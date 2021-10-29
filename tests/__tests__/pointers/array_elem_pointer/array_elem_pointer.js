
import { expect, test } from '@jest/globals';
import { runFile } from '../../../helpers/testsHelper';

let pjs = runFile(import.meta.url, 'array_elem_pointer.pas');
// insp(pjs.engine.tree);

test("write and writeln don't fail", () => {
  expect(pjs.getVarValue('b')).toBe(32)
});


