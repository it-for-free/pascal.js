import { TypesIds } from './Variables/TypesIds';
import { ScalarVariable } from './Variables/ScalarVariable';
import { RuntimeError } from '../Errors/RuntimeError';
import { ErrorsDescription } from '../Errors/ErrorsDescription';
import { ErrorsCodes } from '../Errors/ErrorsCodes';
import { ScalarType } from '../SyntaxAnalyzer/Tree/Types/ScalarType';
import { AppliedNamedType } from '../SyntaxAnalyzer/Tree/Types/AppliedNamedType';
import { ParametersList } from '../SyntaxAnalyzer/Tree/Types/ParametersList';


export class Scope
{
    constructor(parentScope = null)
    {
        this.parentScope = parentScope;
        this.items = {};
        this.constants = {};
        this.types = {};
        this.cycleDepth = 0;
        this.errorsDescription = new ErrorsDescription;
    }

    addVariable(name, type, value = null, treeNode = null)
    {
        let lowerCaseName = name.toLowerCase();
        if (this.items.hasOwnProperty(lowerCaseName)) {
            this.addError(ErrorsCodes.identifierAlreadyUsed, `Variable '${lowerCaseName}' already declared.`, treeNode === null ? type : treeNode);
        } else {
            let variable = null;
            let resolvedType = this.resolveNamedType(type);

            if (resolvedType instanceof ScalarType ||
                resolvedType instanceof ParametersList) {
                variable = new ScalarVariable(value, resolvedType.typeId);
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

    sameType(typeA, typeB)
    {
        if (typeA.constructor === typeB.constructor) {
            if (typeA instanceof ScalarType) {
                return typeA.typeId === typeB.typeId;
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
}