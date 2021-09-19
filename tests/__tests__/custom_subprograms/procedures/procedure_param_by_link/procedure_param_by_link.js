import { expect, test } from '@jest/globals';
import { runFile } from '../../../../helpers/testsHelper';

let pjs = runFile(import.meta.url, 'procedure_param_by_link.pas');

test('b=4', () => {
  expect(pjs.getVarValue('b')).toBe(4);
});

test('a=5', () => {
  expect(pjs.getVarValue('a')).toBe(5);
});

