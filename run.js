const FileIO = require('./IO/FileIO.js');
const ConsoleOutput = require('./IO/ConsoleOutput.js');
const LexicalAnalyzer = require('./LexicalAnalyzer/LexicalAnalyzer.js');
const SyntaxAnalyzer = require('./SyntaxAnalyzer/SyntaxAnalyzer.js');


var fileIO = new FileIO('example.pas', new ConsoleOutput());
var lexicalAnalyzer = new LexicalAnalyzer(fileIO);

var symbol = null;

//for (i= 1; i<= 200; i++) {
//    symbol = lexicalAnalyzer.nextSym();
//    console.log(symbol);
//}

var syntaxAnalyzer = new SyntaxAnalyzer(lexicalAnalyzer);
syntaxAnalyzer.analyze();
