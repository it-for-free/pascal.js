
import { runFile } from 'tests/helpers/testsHelper';
import { expect, test } from '@jest/globals';

let pjs = runFile(import.meta.url, 'constant_coincidence.pas');

test('test case constant branch', () => {
  expect(pjs.getVarValue('m')).toBe(21);
});
