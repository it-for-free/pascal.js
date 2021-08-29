
import { runFile, insp } from '../../../../testsHelper';
import { expect, test } from '@jest/globals';

let pjs = runFile(import.meta.url, 'enum_base.pas');
// insp(engine.scopes);

test('a is "apple"', () => {
  expect(pjs.getVarValue('a')).toBe('apple'); 
});

test('a > b', () => {
  expect(pjs.getVarValue('f')).toBe(false); 
});

test('a = a', () => {
  expect(pjs.getVarValue('g')).toBe(true); 
});

test('a <= b', () => {
  expect(pjs.getVarValue('e')).toBe(true); 
});

test('a <> b', () => {
  expect(pjs.getVarValue('h')).toBe(true); 
});

test('a < b', () => {
  expect(pjs.getVarValue('m')).toBe(true); 
});

