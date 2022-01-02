import { runFile } from 'tests/helpers/testsHelper';
import { expect, test } from '@jest/globals';

let pjs = runFile(import.meta.url, 'variable_index.pas');

test('a1', () => {
  expect(pjs.getVarValue('r')).toBe(23);
});

