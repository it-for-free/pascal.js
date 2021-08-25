
import { runFile, insp } from '../../../../testsHelper';

let pjs = runFile(import.meta.url, 'boolean_base_operations.pas');
// insp(engine.scopes);

test('true and true = true', () => {
  expect(pjs.getVarValue('e')).toBe(true); 
});
test('true and false = false', () => {
  expect(pjs.getVarValue('f')).toBe(false); 
});
test('true or b', () => {
  expect(pjs.getVarValue('g')).toBe(true); 
});
test('a or b', () => {
  expect(pjs.getVarValue('h')).toBe(true); 
});
test('a and b', () => {
  expect(pjs.getVarValue('m')).toBe(false); 
});
test('h or a and b', () => {
  expect(pjs.getVarValue('n')).toBe(false); 
});

test('not b = false', () => {
  expect(pjs.getVarValue('k')).toBe(true); 
});

test('not a = true', () => {
  expect(pjs.getVarValue('y')).toBe(false); 
});




