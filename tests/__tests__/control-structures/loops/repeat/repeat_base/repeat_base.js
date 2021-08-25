
import { runFile, insp } from '../../../../../testsHelper';

let pjs = runFile(import.meta.url, 'repeat_base.pas');

test('repeat loop -- base test ', () => { 
    expect(pjs.getVarValue('a')).toBe(10);
});



