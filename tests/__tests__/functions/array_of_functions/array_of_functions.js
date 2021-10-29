
import { expect, test } from '@jest/globals';
import { runFile } from '../../../helpers/testsHelper';

let pjs = runFile(import.meta.url, 'array_of_functions.pas');
// insp(pjs.engine.tree);

test("write and writeln don't fail", () => {
  expect(pjs.getVarValue('a')).toBe(25)
});


