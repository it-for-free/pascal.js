
import { FileIO } from '../IO/FileIO';
import { ConsoleOutput } from '../IO/ConsoleOutput';
import { LexicalAnalyzer } from '../LexicalAnalyzer/LexicalAnalyzer';
import { SyntaxAnalyzer } from '../SyntaxAnalyzer/SyntaxAnalyzer';
import { Engine } from '../Semantics/Engine';
import { RuntimeError } from '../Errors/RuntimeError';
import { config } from './demoConfig';
export class PascalJs {
    /**
     * @type Engine  
     */
    engine;

    /**
     * Possible run/parce error
     */
    error;

    constructor(config) {
        this.config = config;
    }

    runFile(filePath) {

        try {
            var fileIO = new FileIO(filePath,
                new ConsoleOutput()
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
        return this.getVar(varName).value;
    }
}