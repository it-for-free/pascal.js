import { FileIO } from './src/IO/FileIO';
import { ConsoleOutput } from './src/IO/ConsoleOutput';
import { LexicalAnalyzer } from './src/LexicalAnalyzer/LexicalAnalyzer';
import { SyntaxAnalyzer } from './src/SyntaxAnalyzer/SyntaxAnalyzer';
import { Engine } from './src/Semantics/Engine';
import { RuntimeError } from './src/Errors/RuntimeError';
import { config } from './src/PascalJs/demoConfig';


var fileIO = new FileIO('example.pas', new ConsoleOutput());
var lexicalAnalyzer = new LexicalAnalyzer(fileIO);

var symbol = null;

//for (i= 1; i<= 200; i++) {
//    symbol = lexicalAnalyzer.nextSym();
//    console.log(symbol);
//}

var syntaxAnalyzer = new SyntaxAnalyzer(lexicalAnalyzer);
//try {
    var tree = syntaxAnalyzer.analyze();
//    console.dir(tree, { depth: null });

    var engine = new Engine(tree, config);
    engine.run();
//    console.dir(engine.scopes, { depth: null });
//    console.dir(engine.scopes[0].items, { depth: null });
//} catch (e) {
//    if (e instanceof RuntimeError) {
//        fileIO.printListing(e);
//    }
//}