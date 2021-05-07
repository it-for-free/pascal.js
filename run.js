const FileIO = require('./IO/FileIO.js');
const ConsoleOutput = require('./IO/ConsoleOutput.js');
const LexicalAnalyzer = require('./LexicalAnalyzer/LexicalAnalyzer.js');
const SyntaxAnalyzer = require('./SyntaxAnalyzer/SyntaxAnalyzer.js');
const Engine = require('./Semantics/Engine.js');


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
