
import { runFile, insp } from '../../../testsHelper';

let pjs = runFile(import.meta.url, 'enum_iteration.pas');
// insp(engine.scopes);

test('for to', () => {
  expect(pjs.getVarValue('i')).toBe(3); 
});

test('for downto', () => {
  expect(pjs.getVarValue('j')).toBe(5); 
});

test('for with start > end', () => {
  expect(pjs.getVarValue('k')).toBe(0); 
});

