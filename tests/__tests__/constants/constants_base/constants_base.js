
import { runFile } from 'tests/helpers/testsHelper';
import { expect, test } from '@jest/globals';
let pjs = runFile(import.meta.url, 'constants_base.pas');
// insp(engine.scopes);

test('a', () => {
  expect(pjs.getVarValue('a')).toBe(123); 
});

