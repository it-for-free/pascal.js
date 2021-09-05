import { TypesIds } from './Variables/TypesIds';
import { ScalarVariable } from './Variables/ScalarVariable';
import { EnumVariable } from './Variables/EnumVariable';
import { ArrayVariable } from './Variables/ArrayVariable';
import { RuntimeError } from '../Errors/RuntimeError';
import { ErrorsDescription } from '../Errors/ErrorsDescription';
import { ErrorsCodes } from '../Errors/ErrorsCodes';
import { ScalarType } from '../SyntaxAnalyzer/Tree/Types/ScalarType';
import { AppliedNamedType } from '../SyntaxAnalyzer/Tree/Types/AppliedNamedType';
import { EnumType } from '../SyntaxAnalyzer/Tree/Types/EnumType';
import { ArrayType } from '../SyntaxAnalyzer/Tree/Types/ArrayType';
import { Identifier } from '../SyntaxAnalyzer/Tree/Identifier';
import { IndexedIdentifier } from '../SyntaxAnalyzer/Tree/Arrays/IndexedIdentifier';
import { IndexedFunctionCall } from '../SyntaxAnalyzer/Tree/Arrays/IndexedFunctionCall';
import { IndexRing } from '../SyntaxAnalyzer/Tree/Arrays/IndexRing';
import { Constant } from '../SyntaxAnalyzer/Tree/Constant';
import { UnaryMinus } from '../SyntaxAnalyzer/Tree/UnaryMinus';



export class Scope
{
    constructor(parentScope = null)
    {
        this.parentScope = parentScope;
        this.items = {};
        this.constants = {};
        this.enumsItems = {};
        this.types = {};
        this.cycleDepth = 0;
        this.errorsDescription = new ErrorsDescription;
        this.parametersList = null;
    }

    addVariable(name, type, value = null, treeNode = null)
    {
        let lowerCaseName = name.toLowerCase();
        if (this.constants.hasOwnProperty(lowerCaseName)) {
            this.addError(ErrorsCodes.identifierAlreadyUsed, `Constant '${lowerCaseName}' declared.`, treeNode === null ? type : treeNode);
        } else if (this.items.hasOwnProperty(lowerCaseName)) {
            this.addError(ErrorsCodes.identifierAlreadyUsed, `Variable '${lowerCaseName}' already declared.`, treeNode === null ? type : treeNode);
        } else {
            this.items[lowerCaseName] = this.createVariable(type, value);
        }
    }

    createVariable(type, value = null)
    {
        let resolvedType = this.resolveNamedType(type);

        if (resolvedType instanceof ScalarType) {
            if (value === null) {
                switch (resolvedType.typeId) {
                    case TypesIds.INTEGER:
                    case TypesIds.REAL:
                        value = 0;
                        break;
                    case TypesIds.CHAR:
                        value = String.fromCharCode(0);
                        break;
                    case TypesIds.STRING:
                        value = '';
                        break;
                }
            }
            return new ScalarVariable(value, resolvedType.typeId);
        } else if (resolvedType instanceof EnumType) {
            if (value === null) {
                value = resolvedType.items[0];
            }
            return new EnumVariable(value, resolvedType);
        } else if (resolvedType instanceof ArrayType) {
            return this.createArrayVariable(value, type);
        }
    }

    getIntegerValueOfIndexConstant(constant)
    {
        if (constant instanceof Constant) {
            let typeId = constant.typeId;
            switch (typeId) {
                case TypesIds.INTEGER:
                    return constant.symbol.value;
                case TypesIds.CHAR:
                    return constant.symbol.stringValue.charCodeAt(0);
                case TypesIds.ENUM:
                    let enumElement = this.getEnumElement(constant);
                    return enumElement.getIndex();
            }
        } else if (constant instanceof UnaryMinus) {
            let valueExpression = constant.value;
            if (valueExpression instanceof Constant &&
                valueExpression.typeId === TypesIds.INTEGER) {
                return -valueExpression.symbol.value;
            } else {
                this.addError(ErrorsCodes.typesMismatch, `Integer constant expected after unary minus.`, valueExpression);
            }
        }
    }

    getIntegerValueOfIndexVariable(variable)
    {
        let typeId = variable.typeId;
        switch (typeId) {
            case TypesIds.INTEGER:
                return variable.value;
            case TypesIds.CHAR:
                return variable.value.charCodeAt(0);
            case TypesIds.ENUM:
                let enumElement = this.getEnumElement(variable.value);
                return enumElement.getIndex();
        }
    }

    createArrayVariable(parentArray, type)
    {
        let resolvedType = this.resolveNamedType(type);
        let variable = new ArrayVariable(resolvedType, this);

        variable.parentArray = parentArray;
        let leftIndex = resolvedType.leftIndex;
        let rightIndex = resolvedType.rightIndex;
        let leftIntegerIndex = this.getIntegerValueOfIndexConstant(leftIndex);
        let rightIntegerIndex = this.getIntegerValueOfIndexConstant(rightIndex);

        let minIntegerIndex = Math.min(leftIntegerIndex, rightIntegerIndex);
        let maxIntegerIndex = Math.max(leftIntegerIndex, rightIntegerIndex);
        let offset = -minIntegerIndex;

        variable.offset = offset;
        variable.arrayLength = maxIntegerIndex - minIntegerIndex + 1;
        variable.leftIntegerIndex = 0;
        variable.rightIntegerIndex = maxIntegerIndex;
        variable.rightIntegerIndex = maxIntegerIndex;

        return variable;
    }

    resolveNamedType(type)
    {
        if (type instanceof AppliedNamedType) {
            let name = type.symbol.stringValue;
            let refType = this.getType(name);
            return this.resolveNamedType(refType);
        } else {
            return  type;
        }
    }

    /**
     *  Для ScalarVariable используется только typeId.
     *  В type передаётся тип или id типа.
     */
    setValue(destination, type, value, treeNode = null)
    {
        let identifier = null;

        if (destination instanceof Identifier) {
            identifier = destination;
        } else if (destination instanceof IndexedIdentifier) {
            identifier = destination.identifier;
        }
        let name = identifier.symbol.stringValue;
        let lowerCaseName = name.toLowerCase();
        if (!this.items.hasOwnProperty(lowerCaseName)) {
            this.addError(ErrorsCodes.variableNotDeclared, `Variable '${lowerCaseName}' not declared.`, treeNode);
        } else {
            let item = this.items[lowerCaseName];

            if (item instanceof ScalarVariable ||
                item instanceof EnumVariable) {
                if (Number.isInteger(type) &&
                    type === item.typeId ||
                    !Number.isInteger(type) &&
                    this.sameType(item.type, type)) {

                    this.items[lowerCaseName].value = value;
                } else {
                    this.addError(ErrorsCodes.typesMismatch, null, treeNode);
                }
            } else if (item instanceof ArrayVariable) {
                let indexRing = destination.indexRing;
                let destinationType = this.getDestinationType(item.type, indexRing);
                if (Number.isInteger(type) &&
                    type === destinationType.typeId ||
                    !Number.isInteger(type) &&
                    this.sameType(destinationType, type)) {

                    item.setValue(indexRing, type, value);
                } else {
                    this.addError(ErrorsCodes.typesMismatch, null, treeNode);
                }
            } else {
                this.addError(ErrorsCodes.typesMismatch, null, treeNode);
            }
        }
    }

    getDestinationType(arrayType, indexRing)
    {
        return  arrayType instanceof ArrayType &&
                indexRing !== null ?
                this.getDestinationType(arrayType.typeOfElements, indexRing.indexRing) :
                arrayType;
    }

    getVariable(name)
    {
        let lowerCaseName = name.toLowerCase();
        if (this.items.hasOwnProperty(lowerCaseName)) {
            return this.items[lowerCaseName];
        }
    }

    getElementByIdentifier(identifier)
    {
        if (identifier instanceof Identifier) {
            let name = identifier.symbol.value;
            let lowerCaseName = name.toLowerCase();

            if (this.constants.hasOwnProperty(lowerCaseName)) {
                return this.constants[lowerCaseName];
            } else if (this.items.hasOwnProperty(lowerCaseName)) {
                return this.items[lowerCaseName];
            } else if (this.enumsItems.hasOwnProperty(lowerCaseName)) {
                return this.enumsItems[lowerCaseName];
            } else {
                this.addError(ErrorsCodes.variableNotDeclared, `Element '${lowerCaseName}' not declared.`, identifier);
            }
        }
    }

    getElementByIndexedIdentifier(indexedIdentifier)
    {
        let identifier = indexedIdentifier.identifier;
        let arrayVariable = this.getElementByIdentifier(identifier);
        return arrayVariable.getByIndexRing(indexedIdentifier.indexRing);
    }

    getEnumElement(identifier)
    {
        let name = identifier.symbol.value;
        let lowerCaseName = name.toLowerCase();

        if (this.enumsItems.hasOwnProperty(lowerCaseName)) {
            return this.enumsItems[lowerCaseName];
        } else {
            this.addError(ErrorsCodes.variableNotDeclared, `Enum element '${lowerCaseName}' not declared.`, identifier);
        }
    }

    sameType(typeA, typeB)
    {
        if (typeA.constructor === typeB.constructor) {
            if (typeA instanceof ScalarType) {
                return typeA.typeId === typeB.typeId;
            } else if (typeA instanceof EnumType) {
                return Object.is(typeA, typeB);
            }
        } else {
            return false;
        }
    }

    addError(errorCode, errorText = null, treeNode = null)
    {
        let message = this.errorsDescription.getErrorTextByCode(errorCode) +
                (errorText === null ? '' : ('. ' + errorText));
        let currentPosition = treeNode === null ? null : treeNode.symbol.textPosition;
        throw new RuntimeError(errorCode, message, currentPosition);
    }

    addType(typeDeclaration)
    {
        let name = typeDeclaration.identifier.symbol.stringValue;
        let lowerCaseName = name.toLowerCase();
        if (this.types.hasOwnProperty(lowerCaseName)) {
            this.addError(ErrorsCodes.identifierAlreadyUsed, `Type '${lowerCaseName}' already declared.`, typeDeclaration);
        } else {
            this.types[lowerCaseName] = typeDeclaration.type;
            if (typeDeclaration.type instanceof EnumType) {
                let self = this;
                typeDeclaration.type.items.forEach(function(enumItem) {
                    let lowerCaseName = enumItem.symbol.stringValue.toLowerCase();
                    if (self.enumsItems.hasOwnProperty(lowerCaseName)) {
                        self.addError(ErrorsCodes.identifierAlreadyUsed, `Enumeration item '${lowerCaseName}' already declared.`, enumItem);
                    }
                    self.enumsItems[lowerCaseName] = new EnumVariable(enumItem, typeDeclaration.type);
                });
            }
        }
    }

    getType(name, treeNode = null)
    {
        let lowerCaseName = name.toLowerCase();
        if (this.types.hasOwnProperty(lowerCaseName)) {
            return this.types[lowerCaseName];
        } else {
            this.addError(ErrorsCodes.typeNotDeclared, `Type '${lowerCaseName}' not declared.`, treeNode);
        }
    }

    getParametersList()
    {
        return this.parametersList;
    }

    setParametersList(ParametersList)
    {
        this.parametersList = ParametersList;
    }

    addConstant(constantDeclaration)
    {
        let name = constantDeclaration.identifier.symbol.stringValue;
        let type = constantDeclaration.type;
        let value = constantDeclaration.value;
        let lowerCaseName = name.toLowerCase();
        if (this.constants.hasOwnProperty(lowerCaseName)) {
            this.addError(ErrorsCodes.identifierAlreadyUsed, `Constant '${lowerCaseName}' already declared.`, constantDeclaration);
        } else {
            let constant = null;
            let resolvedType = this.resolveNamedType(type);

            if (resolvedType === null ||
                resolvedType instanceof ScalarType) {
                constant = new ScalarVariable(value.symbol.value, type ? resolvedType.typeId : value.typeId);
            }

            this.constants[lowerCaseName] = constant;
        }
    }

    getVariableByReference(variableIdentifier)
    {
        let name = variableIdentifier.symbol.value;
        let lowerCaseName = name.toLowerCase();

        if (!this.items.hasOwnProperty(lowerCaseName)) {
            this.addError(ErrorsCodes.variableNotDeclared, `Variable '${lowerCaseName}' not declared.`, variableIdentifier);
        } else {
            return this.items[lowerCaseName];
        }
    }

    addVariableByReference(variableIdentifier, parameterIdentifier)
    {
        let name = parameterIdentifier.symbol.value;
        let lowerCaseName = name.toLowerCase();

        let variable = this.parentScope.getVariableByReference(variableIdentifier);
        this.items[lowerCaseName] = variable;
    }
}