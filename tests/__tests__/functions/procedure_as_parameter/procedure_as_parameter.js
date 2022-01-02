
import { expect, test } from '@jest/globals';
import { runFile } from '../../../helpers/testsHelper';

let pjs = runFile(import.meta.url, 'procedure_as_parameter.pas');

test("write and writeln don't fail", () => {
  expect(pjs.getVarValue('a')).toBe(16)
});


