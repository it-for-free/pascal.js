import { FileIO, ConsoleOutput, LexicalAnalyzer, 
  SyntaxAnalyzer, Engine   } from '../../../src/pascal.js';
import { getFullPath, insp } from '../../testsHelper';

var fileIO = new FileIO(
  getFullPath(import.meta.url, 'div_mod_base.pas'),
  new ConsoleOutput()
);
var lexicalAnalyzer = new LexicalAnalyzer(fileIO);
var syntaxAnalyzer = new SyntaxAnalyzer(lexicalAnalyzer);
var tree = syntaxAnalyzer.analyze();
var engine = new Engine(tree);
engine.run();
// insp(engine.scopes);

test('values', () => {
  expect(engine.getCurrentScope().items.a.value).toBe(3);
  expect(engine.getCurrentScope().items.b.value).toBe(4);
});

test('types', () => {
  expect(engine.getCurrentScope().items.a.typeId).toBe(0);
  expect(engine.getCurrentScope().items.b.typeId).toBe(0);
});


