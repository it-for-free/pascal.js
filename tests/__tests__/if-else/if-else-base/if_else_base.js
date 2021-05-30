
import { runFile, insp } from '../../../testsHelper';

let pjs = runFile(import.meta.url, 'if_else_base.pas');
// insp(engine.scopes);

test('max among 4 values', () => {
  expect(pjs.getVarValue('max4')).toBe(19);
});


