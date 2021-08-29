
import { runFile, insp } from '../../../../../testsHelper';
import { expect, test } from '@jest/globals';

let pjs = runFile(import.meta.url, 'repeat_base.pas');

test('repeat loop -- base test ', () => { 
    expect(pjs.getVarValue('a')).toBe(10);
});



