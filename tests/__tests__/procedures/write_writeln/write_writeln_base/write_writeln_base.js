
import { expect, test } from '@jest/globals';
import { runFile } from '../../../../helpers/testsHelper';

let pjs = runFile(import.meta.url, 'write_writeln_base.pas');
// insp(pjs.engine.tree);

test("write and writeln don't fail", () => {
  expect('test').toBe('test'); // formal assert (just tests that write and writeln don't fail)
});


