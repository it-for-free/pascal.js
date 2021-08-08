
import { runFile, insp } from '../../../../testsHelper';

let pjs = runFile(import.meta.url, 'for_base.pas');

test('for loop -- base test ', () => { 
    expect(pjs.getVarValue('a')).toBe(10);
});



