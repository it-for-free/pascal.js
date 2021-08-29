
import { runFile, insp } from '../../../testsHelper';
import { expect, test } from '@jest/globals';

let pjs = runFile(import.meta.url, 'div_mod_base.pas');
// insp(pjs);

test('values', () => {
  expect(pjs.getVarValue('a')).toBe(3);
  expect(pjs.getVarValue('b')).toBe(4);
});

test('types', () => {
  expect(pjs.getVar('a').typeId).toBe(0);
  expect(pjs.getVar('b').typeId).toBe(0);
});


