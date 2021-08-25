
import { runFile, insp } from '../../../../../testsHelper';

let pjs = runFile(import.meta.url, 'while_base.pas');

test('while loop -- base test ', () => { 
    expect(pjs.getVarValue('a')).toBe(10);
});



