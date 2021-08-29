
import { runFile, insp } from '../../../../testsHelper';

let pjs = runFile(import.meta.url, 'arrays_base.pas');
insp(pjs.getVarValue('a'), 'array a ');

test('a is true', () => {
  expect(pjs.getVarValue('a')).toBe(true); 
});



