
import { runFile } from 'tests/helpers/testsHelper';
import { expect, test } from '@jest/globals';
let pjs = runFile(import.meta.url, 'variables_initialization.pas');
// insp(engine.scopes);

test('a', () => {
  expect(pjs.getVarValue('i')).toBe(1555);
  expect(pjs.getVarValue('k')).toBe(1555);
});

