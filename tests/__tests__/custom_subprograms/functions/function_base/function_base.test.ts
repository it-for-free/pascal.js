import { expect, test } from '@jest/globals';
import { runFile } from '../../../../helpers/testsHelper';

let pjs = runFile(import.meta.url, 'function_base.pas');

test('b=4', () => {
  expect(pjs.getVarValue('b')).toBe(4);
});

test('a=8', () => {
  expect(pjs.getVarValue('a')).toBe(8);
});

