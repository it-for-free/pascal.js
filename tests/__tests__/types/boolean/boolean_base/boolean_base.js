
import { runFile } from 'tests/helpers/testsHelper';
import { expect, test } from '@jest/globals';
let pjs = runFile(import.meta.url, 'boolean_base.pas');
// insp(engine.scopes);

test('a is true', () => {
  expect(pjs.getVarValue('a')).toBe(true); 
});
test('b is false', () => {
  expect(pjs.getVarValue('b')).toBe(false); 
});


