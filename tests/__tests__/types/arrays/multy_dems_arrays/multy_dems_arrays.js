import { expect, test } from '@jest/globals';
import { runFile, insp } from '../../../../testsHelper';

let pjs = runFile(import.meta.url, 'multy_dems_arrays.pas');
// insp(pjs.getVarValue('a'), ' a ');

test('a3', () => {
  expect(pjs.getVarValue('a3')).toBe(5); 
});




