
import { runFile } from 'tests/helpers/testsHelper';
import { expect, test } from '@jest/globals';

let pjs = runFile(import.meta.url, 'for_base.pas');

test('for loop -- base test ', () => { 
    expect(pjs.getVarValue('a')).toBe(10);
});



