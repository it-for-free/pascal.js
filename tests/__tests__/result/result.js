import { runFile } from 'tests/helpers/testsHelper';
import { expect, test } from '@jest/globals';
let pjs = runFile(import.meta.url, 'result.pas');
// insp(engine.scopes);

test('result for c', () => {
  expect(pjs.getVarValue('c')).toBe(90); 
});