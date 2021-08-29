
import { runFile, insp } from '../../../testsHelper';
import { expect, test } from '@jest/globals';

let pjs = runFile(import.meta.url, 'last_operation_works.pas');
// insp(pjs.engine.tree);

test("write and writeln don't fail", () => {
  expect(pjs.getVarValue('i')).toBe(2)
});


