import { expect, test } from '@jest/globals';
import { runFile, insp } from '../../../../../testsHelper';

let pjs = runFile(import.meta.url, 'multy_dem_arrays_base.pas');
// insp(pjs.getVarValue('a'), ' a ');

test('a3', () => {
  expect(pjs.getVarValue('a3')).toBe(5); 
});

test('b3', () => {
  expect(pjs.getVarValue('b3')).toBe(5); 
});




