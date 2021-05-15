const FileIO = require('./src/IO/FileIO.js');
const ConsoleOutput = require('./src/IO/ConsoleOutput.js');
const LexicalAnalyzer = require('./src/LexicalAnalyzer/LexicalAnalyzer.js');
const SyntaxAnalyzer = require('./src/SyntaxAnalyzer/SyntaxAnalyzer.js');
const Engine = require('./src/Semantics/Engine.js');


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
