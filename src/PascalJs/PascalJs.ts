
import { FileIO } from '../IO/FileIO';
import { LexicalAnalyzer } from '../LexicalAnalyzer/LexicalAnalyzer';
import { SyntaxAnalyzer } from '../SyntaxAnalyzer/SyntaxAnalyzer';
import { Engine } from '../Semantics/Engine';
import { RuntimeError } from '../Errors/RuntimeError';
import { TypesIds } from '../Semantics/Variables/TypesIds';
import { PascalJsConfig } from './types';
import { StringIO } from '../IO/StringIO';

export class PascalJs {

    engine: Engine;
    error: RuntimeError;
    config: PascalJsConfig;

    constructor(config: PascalJsConfig) {
        this.config = config;
    }

    runFile(filePath) {

        try {
            var fileIO = new FileIO(filePath,
                this.config.listingOutput
            );
            var lexicalAnalyzer = new LexicalAnalyzer(fileIO);
            var syntaxAnalyzer = new SyntaxAnalyzer(lexicalAnalyzer);
            var tree = syntaxAnalyzer.analyze();
            var engine = new Engine(tree, this.config);
            engine.run();
        } catch (e) {

            if (e instanceof RuntimeError) {
                this.error = e;
            } else throw e;
        }


        this.engine = engine;
        return engine;
    }

    runString(programText: string) {

        try {
            var fileIO = new StringIO(programText,
                this.config.listingOutput
            );
            var lexicalAnalyzer = new LexicalAnalyzer(fileIO);
            var syntaxAnalyzer = new SyntaxAnalyzer(lexicalAnalyzer);
            var tree = syntaxAnalyzer.analyze();
            var engine = new Engine(tree, this.config);
            engine.run();
        } catch (e) {

            if (e instanceof RuntimeError) {
                this.error = e;
            } else throw e;
        }


        this.engine = engine;
        return engine;
    }


    getVar(varName) {
        return this.engine.getCurrentScope().items[varName];
    }

    getVarValue(varName) {
        let variable = this.getVar(varName);
        
        if (variable.typeId === TypesIds.ARRAY) {
            return this.getVar(varName).items;
        } else  if (variable.typeId === TypesIds.ENUM) {
            return this.getVar(varName).value.symbol.stringValue;
        } else {
            return this.getVar(varName).value;
        }
    }

    getError() {
       return this.error;   
    }
}