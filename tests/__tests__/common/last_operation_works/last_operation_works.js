
import { expect, test } from '@jest/globals';
import { runFile } from '../../../helpers/testsHelper';

let pjs = runFile(import.meta.url, 'last_operation_works.pas');
// insp(pjs.engine.tree);

test("write and writeln don't fail", () => {
  expect(pjs.getVarValue('i')).toBe(2)
});


