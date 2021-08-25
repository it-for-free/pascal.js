
import { runFile, insp } from '../../../../testsHelper';

let pjs = runFile(import.meta.url, 'boolean_base.pas');
// insp(engine.scopes);

test('a is true', () => {
  expect(pjs.getVarValue('a')).toBe(true); 
});
test('b is false', () => {
  expect(pjs.getVarValue('b')).toBe(false); 
});


