import { runFile } from 'tests/helpers/testsHelper';
import { expect, test } from '@jest/globals';
let pjs = runFile(import.meta.url, 'result3.pas');
insp(20, comment = 'получили 20');
//с передачей аргумента в функцию

test('result 3', () => {
  expect(pjs.getVarValue('c')).toBe(20); 
});
