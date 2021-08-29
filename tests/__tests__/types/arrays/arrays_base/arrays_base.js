import { runFile, insp } from '../../../../testsHelper';
import { expect, test } from '@jest/globals';

let pjs = runFile(import.meta.url, 'arrays_base.pas');
// insp(pjs.getVarValue('a'), ' a ');

test('a1', () => {
  expect(pjs.getVarValue('a1')).toBe(5); 
});

test('a2', () => {
  expect(pjs.getVarValue('a2')).toBe(4); 
});



