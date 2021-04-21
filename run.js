const FileIO = require('./IO/FileIO.js');
const ConsoleOutput = require('./IO/ConsoleOutput.js');
const LexicalAnalyzer = require('./LexicalAnalyzer/LexicalAnalyzer.js');
const ErrorsDescription = require('./Errors/ErrorsDescription.js');

fileIO = new FileIO('example.pas', new ConsoleOutput( new ErrorsDescription() ));



for (i= 1; i<= 200; i++) {
    char = fileIO.nextCh();
//    process.stdout.write('' + char);
}


//analyze = new LexicalAnalyzer();


var re = /[a-z]/i;
//var text = 'o12_asf_aa';
var text = 'A';
var match = re.exec(text);
console.log(match);