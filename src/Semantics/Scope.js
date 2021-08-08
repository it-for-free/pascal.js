import { TypesIds } from './Variables/TypesIds';
import { ScalarVariable } from './Variables/ScalarVariable';
import { EnumVariable } from './Variables/EnumVariable';
import { RuntimeError } from '../Errors/RuntimeError';
import { ErrorsDescription } from '../Errors/ErrorsDescription';
import { ErrorsCodes } from '../Errors/ErrorsCodes';
import { ScalarType } from '../SyntaxAnalyzer/Tree/Types/ScalarType';
import { AppliedNamedType } from '../SyntaxAnalyzer/Tree/Types/AppliedNamedType';
import { EnumType } from '../SyntaxAnalyzer/Tree/Types/EnumType';
import { Identifier } from '../SyntaxAnalyzer/Tree/Identifier';


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
            let variable = null;
            let resolvedType = this.resolveNamedType(type);

            if (resolvedType instanceof ScalarType) {
                variable = new ScalarVariable(value, resolvedType.typeId);
            } else if (resolvedType instanceof EnumType) {
                variable = new EnumVariable(value, resolvedType);
            }

            this.items[lowerCaseName] = variable;
        }
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
    setValue(name, type, value, treeNode = null)
    {
        let lowerCaseName = name.toLowerCase();
        if (!this.items.hasOwnProperty(lowerCaseName)) {
            this.addError(ErrorsCodes.variableNotDeclared, `Variable '${lowerCaseName}' not declared.`, treeNode);
        } else {
            let item = this.items[lowerCaseName];

            if (Number.isInteger(type) &&
                item instanceof ScalarVariable &&
                type === item.typeId ||
                !Number.isInteger(type) &&
                this.sameType(item.type, type)) {
                this.items[lowerCaseName].value = value;
            } else {
                this.addError(ErrorsCodes.typesMismatch, null, treeNode);
            }
        }
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
            }
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
}