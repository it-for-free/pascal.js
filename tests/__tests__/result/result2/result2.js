import { runFile } from 'tests/helpers/testsHelper';
import { expect, test } from '@jest/globals';
let pjs = runFile(import.meta.url, 'result2.pas');
//с передачей аргумента в функцию

test('result 2', () => {
  expect(pjs.getVarValue('c')).toBe(36); 
});