
import { runFile } from 'tests/helpers/testsHelper';
import { expect, test } from '@jest/globals';

let pjs = runFile(import.meta.url, 'else_branch.pas');
// insp(engine.scopes);

test('test case else branch', () => {
  expect(pjs.getVarValue('m')).toBe(29);
});