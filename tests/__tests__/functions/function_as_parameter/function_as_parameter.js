
import { expect, test } from '@jest/globals';
import { runFile } from '../../../helpers/testsHelper';

let pjs = runFile(import.meta.url, 'function_as_parameter.pas');
// insp(pjs.engine.tree);

test("write and writeln don't fail", () => {
  expect(pjs.getVarValue('a')).toBe(8)
});


