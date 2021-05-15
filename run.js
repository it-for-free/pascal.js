import { FileIO } from './src/IO/FileIO';
import { ConsoleOutput } from './src/IO/ConsoleOutput';
import { LexicalAnalyzer } from './src/LexicalAnalyzer/LexicalAnalyzer';
import { SyntaxAnalyzer } from './src/SyntaxAnalyzer/SyntaxAnalyzer';
import { Engine } from './src/Semantics/Engine';


var fileIO = new FileIO('example.pas', new ConsoleOutput());
var lexicalAnalyzer = new LexicalAnalyzer(fileIO);

var symbol = null;

//for (i= 1; i<= 200; i++) {
//    symbol = lexicalAnalyzer.nextSym();
//    console.log(symbol);
//}

var syntaxAnalyzer = new SyntaxAnalyzer(lexicalAnalyzer);
var tree = syntaxAnalyzer.analyze();
console.dir(tree, { depth: null });

var engine = new Engine(tree);
engine.run();
