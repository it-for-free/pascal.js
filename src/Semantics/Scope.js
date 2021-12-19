import { TypesIds } from './Variables/TypesIds';
import { ScalarVariable } from './Variables/ScalarVariable';
import { EnumVariable } from './Variables/EnumVariable';
import { ArrayVariable } from './Variables/ArrayVariable';
import { PointerVariable } from './Variables/PointerVariable';
import { RecordVariable } from './Variables/RecordVariable';
import { CallableVariable } from './Variables/CallableVariable';
import { RuntimeError } from '../Errors/RuntimeError';
import { ErrorsDescription } from '../Errors/ErrorsDescription';
import { ErrorsCodes } from '../Errors/ErrorsCodes';
import { ScalarType } from '../SyntaxAnalyzer/Tree/Types/ScalarType';
import { AppliedNamedType } from '../SyntaxAnalyzer/Tree/Types/AppliedNamedType';
import { EnumType } from '../SyntaxAnalyzer/Tree/Types/EnumType';
import { FunctionType } from '../SyntaxAnalyzer/Tree/Types/FunctionType';
import { ProcedureType } from '../SyntaxAnalyzer/Tree/Types/ProcedureType';
import { ArrayType } from '../SyntaxAnalyzer/Tree/Types/ArrayType';
import { PointerType } from '../SyntaxAnalyzer/Tree/Types/PointerType';
import { RecordType } from '../SyntaxAnalyzer/Tree/Types/RecordType';
import { Identifier } from '../SyntaxAnalyzer/Tree/Identifier';
import { IndexedIdentifier } from '../SyntaxAnalyzer/Tree/Arrays/IndexedIdentifier';
import { IndexRing } from '../SyntaxAnalyzer/Tree/Arrays/IndexRing';
import { Constant } from '../SyntaxAnalyzer/Tree/Constant';
import { UnaryMinus } from '../SyntaxAnalyzer/Tree/UnaryMinus';
import { ProcedureItem } from './ProcedureItem';
import { FunctionItem } from './FunctionItem';


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
        this.callableName = null;
    }

    addVariable(identifier, type, value = null, treeNode = null)
    {
        let name = identifier.symbol.value;
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
        } else if (resolvedType instanceof PointerType) {
            let targetType = this.resolveNamedType(type.type);
            return new PointerVariable(value, targetType);
        } else if (resolvedType instanceof FunctionType ||
            resolvedType instanceof ProcedureType ||
            resolvedType instanceof RecordType) {
            return this.createDefaultVariable(resolvedType);
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
                    return constant.symbol.value.charCodeAt(0);
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
                item instanceof EnumVariable ||
                item instanceof CallableVariable) {
                if (this.sameType(item.getType(), type)) {
                    this.items[lowerCaseName].value = value;
                } else {
                    this.addTypeMismatchError(type, item, treeNode);
                }
            } else if (item instanceof ArrayVariable) {

                let destinationType = null;
                if (destination instanceof Identifier) {
                    destinationType = item.type;
                    if (this.sameType(type, destinationType)) {;
                        this.setVariableObject(destination, value.clone());
                    } else {
                        this.addTypeMismatchError(type, item, treeNode);
                    }
                } else if (destination instanceof IndexedIdentifier) {
                    let indexRing = destination.indexRing;
                    destinationType = this.getDestinationType(item.type, indexRing);
                    if (this.sameType(type, destinationType)) {
                        if (value instanceof ArrayVariable) {
                            value = value.clone();
                        }
                        item.setValue(indexRing, type, value);
                    } else {
                        this.addTypeMismatchError(type, item, treeNode);
                    }
                }
            } else if (item instanceof PointerVariable &&
                    type instanceof PointerType) {

                    if (this.sameType(item.type, type)) {
                        item.variable = value.variable;
                    } else {
                        this.addTypeMismatchError(type, item, treeNode);
                    }
            } else {
                this.addError(ErrorsCodes.typesMismatch, null, treeNode);
            }
        }
    }

    /**
     *  Для ScalarVariable используется только typeId.
     *  В type передаётся тип или id типа.
     */
    setVariableValue(destination, variable, treeNode = null)
    {
        let type = variable.getType();
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
                item instanceof EnumVariable ||
                item instanceof CallableVariable ||
                item instanceof ArrayVariable &&
                destination instanceof Identifier ||
                item instanceof RecordVariable ) {

                if (this.sameType(item.getType(), type)) {
                } else {
                    this.addTypeMismatchError(type, item, treeNode);
                }
            }

            if (item instanceof ScalarVariable ||
                item instanceof EnumVariable ||
                item instanceof CallableVariable) {

                this.items[lowerCaseName].value = variable.value;
            } else if (item instanceof ArrayVariable) {
                if (destination instanceof Identifier) {
                    this.setVariableObject(destination, variable.clone());
                } else if (destination instanceof IndexedIdentifier) {
                    let indexRing = destination.indexRing;
                    let destinationType = this.getDestinationType(item.type, indexRing);
                    if (this.sameType(type, destinationType)) {
//                        if (variable instanceof ScalarVariable ||
//                            variable instanceof EnumVariable ||
//                            variable instanceof CallableVariable) {
////                            variable = variable.value;
//                        } else {
//                        }
                        variable = variable.clone();
                        item.setValue(indexRing, type, variable);
                    } else {
                        this.addTypeMismatchError(type, item, treeNode);
                    }
                }
            } else if (item instanceof RecordVariable) {
                this.setVariableObject(destination, variable.clone());
            } else if (item instanceof PointerVariable &&
                type instanceof PointerType) {
                if (this.sameType(item.type, type)) {
                    item.variable = variable.variable;
                } else {
                    this.addTypeMismatchError(type, item, treeNode);
                }
            } else {
                this.addError(ErrorsCodes.typesMismatch, null, treeNode);
            }
        }
    }

    setRecordVariableProperty(recordVariable, propertyIdentifier, variable)
    {
        let type = variable.getType();

        let item = recordVariable.getByPropertyIdentifier(propertyIdentifier);

        if (this.sameType(item.getType(), type)) {
        } else {
            this.addTypeMismatchError(type, item, propertyIdentifier);
        }

        if (item instanceof ScalarVariable ||
            item instanceof EnumVariable ||
            item instanceof CallableVariable) {
            item.value = variable.value;
        } else if (item instanceof ArrayVariable ||
            item instanceof RecordVariable) {

            recordVariable.setPropertyByPropertyIdentifier(propertyIdentifier, variable.clone());
        } else {
            this.addError(ErrorsCodes.typesMismatch, null, propertyIdentifier);
        }
    }

    setVariableObject(destinationIdentifier, variable)
    {
        let name = destinationIdentifier.symbol.stringValue;
        let lowerCaseName = name.toLowerCase();

        this.items[lowerCaseName] = variable;
    }

    addTypeMismatchError(type, item, treeNode)
    {
        let sourceType = Number.isInteger(type) ? new ScalarType(null, type) : type;
        let destinationType = item.type === false ? new ScalarType(null, item.typeId) : item.type;
        this.addError(ErrorsCodes.typesMismatch, `Type ${destinationType} expected but ${sourceType} found.`, treeNode);
    }

    getDestinationType(arrayType, indexRing)
    {
        return  (arrayType instanceof ArrayType &&
                indexRing &&
                indexRing !== null) ?
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
                return null;
            }
        }
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
        if (Number.isInteger(typeA) &&
            Number.isInteger(typeB)) {
            return typeA === typeB;
        } else if (Number.isInteger(typeA) &&
            !Number.isInteger(typeB)) {
            return typeA === typeB.typeId;
        } else if (Number.isInteger(typeB) &&
            !Number.isInteger(typeA)) {
            return typeA.typeId === typeB;
        } else if (typeA.constructor === typeB.constructor) {
            if (typeA instanceof ScalarType) {
                return typeA.typeId === typeB.typeId;
            } else if (typeA instanceof EnumType) {
                return Object.is(typeA, typeB);
            } else if(typeA instanceof FunctionType ||
                    typeA instanceof ProcedureType){
                let aParams = this.getParametersArray(typeA);
                let bParams = this.getParametersArray(typeB);
                let length = aParams.length;
                if (length === bParams.length) {
                    return typeA instanceof FunctionType ?
                        this.sameType(typeA.returnType, typeB.returnType) :
                        true;
                } else {
                    return false;
                }
            } else if (typeA instanceof ArrayType) {
                return this.sameType(typeA.typeOfElements, typeB.typeOfElements) &&
                        typeA.leftIndex.symbol.value === typeB.leftIndex.symbol.value &&
                        typeA.rightIndex.symbol.value === typeB.rightIndex.symbol.value;
            } else if (typeA instanceof PointerType) {
                return this.sameType(typeA.type, typeB.type);
            } else if (typeA instanceof RecordType) {
                let sameSet = Object.keys(typeA.typesList).length === Object.keys(typeB.typesList).length;
                let propertyName = null;
                for (propertyName in typeA.typesList) {
                    if (!sameSet) {
                        return false;
                    }
                    sameSet = sameSet &&
                        typeB.typesList.hasOwnProperty(propertyName) &&
                        this.sameType(typeA.typesList[propertyName], typeB.typesList[propertyName])
                }

                return sameSet;
            }
        } else {
            return false;
        }
    }

    getParametersArray(callableType)
    {
        let parametersArray= [];
        let counter = 0;
        let length = callableType.signature.length;
        for (let i=0; i < length; i++) {
            let item = callableType.signature[i];
            let identLength = item.identifiers.length;
            for (let j=0; j < identLength; j++) {
                parametersArray[counter++] = item;
            }
        }

        return parametersArray;
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

    createDefaultVariable(typeObject)
    {
        if (typeObject instanceof ScalarType) {
            let defaultValue = null;

            switch (typeObject.typeId) {
                case TypesIds.BOOLEAN:
                    defaultValue = false;
                    break;
                case TypesIds.CHAR:
                    defaultValue = String.fromCharCode(0);
                    break;
                case TypesIds.INTEGER:
                    defaultValue = 0;
                    break;
                case TypesIds.REAL:
                    defaultValue = 0;
                    break;
                case TypesIds.STRING:
                    defaultValue = '';
            }

            return new ScalarVariable(defaultValue, typeObject.typeId);
        } else if (typeObject instanceof RecordType) {
            return new RecordVariable(typeObject, this);
        } else if (typeObject instanceof ProcedureType) {
            let procedureItem = new ProcedureItem();
            procedureItem.signature = typeObject.signature;
            procedureItem.type = typeObject;

            return new CallableVariable(typeObject, procedureItem);
        } else if (typeObject instanceof PointerType) {
            return new PointerVariable(null, typeObject);
        } else if (typeObject instanceof FunctionType) {
            let functionItem = new FunctionItem();
            functionItem.signature = typeObject.signature;
            functionItem.returnType = typeObject.returnType;
            functionItem.name = new Identifier({
                value: 'outputValue'
            });
            functionItem.type = typeObject;

            return new CallableVariable(typeObject, functionItem);
        } else if (typeObject instanceof ArrayType) {
            let resolvedType = this.resolveNamedType(typeObject);
            let variable = new ArrayVariable(resolvedType, this);

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
    }
}