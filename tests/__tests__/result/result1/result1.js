import { runFile } from 'tests/helpers/testsHelper';
import { expect, test } from '@jest/globals';
let pjs = runFile(import.meta.url, 'result1.pas');
// insp(engine.scopes);

test('result 1', () => {
  expect(pjs.getVarValue('c')).toBe(555); 
});