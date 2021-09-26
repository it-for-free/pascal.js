
import { runFile } from 'tests/helpers/testsHelper';
import { expect, test } from '@jest/globals';

let pjs = runFile(import.meta.url, 'if_else_base.pas');
// insp(engine.scopes);

test('max among 4 values', () => {
  expect(pjs.getVarValue('max4')).toBe(19);
});


