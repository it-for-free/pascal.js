
import { runFile } from 'tests/helpers/testsHelper';
import { expect, test } from '@jest/globals';

let pjs = runFile(import.meta.url, 'while_base.pas');

test('while loop -- base test ', () => { 
    expect(pjs.getVarValue('a')).toBe(10);
});



