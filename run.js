const FileIO = require('./IO/FileIO.js');
const ConsoleOutput = require('./IO/ConsoleOutput.js');
const LexicalAnalyzer = require('./LexicalAnalyzer/LexicalAnalyzer.js');
const ErrorsDescription = require('./Errors/ErrorsDescription.js');


var fileIO = new FileIO('example.pas', new ConsoleOutput( new ErrorsDescription() ));
var lexicalAnalyzer = new LexicalAnalyzer(fileIO);

var symbol = null;

for (i= 1; i<= 200; i++) {
    symbol = lexicalAnalyzer.nextSym();
    console.log(symbol);
}
