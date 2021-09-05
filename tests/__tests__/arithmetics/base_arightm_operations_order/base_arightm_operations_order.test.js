import { runFile } from 'tests/helpers/testsHelper';
import { expect, test } from '@jest/globals';

let pjs = runFile(import.meta.url, 'base_arightm_operations_order.pas');
// insp(pjs);

test('1 + 5 * 3 = 16', () => {
  expect(pjs.getVarValue('a')).toBe(16);
});

test('25 - 3 * 2 = 19', () => {
  expect(pjs.getVarValue('b')).toBe(19);
});

test('5 - 2/2 + 4 = 8', () => {
  expect(pjs.getVarValue('z')).toBe(8);
});




