import { runFile, insp } from '../../../../testsHelper';
import { expect, test } from '@jest/globals';

let pjs = runFile(import.meta.url, 'arrays_enum_keys.pas');
// insp(pjs.getVarValue('a'), ' a ');

test('a1', () => {
  expect(pjs.getVarValue('a1')).toBe(10); 
});



