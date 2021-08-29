
import { runFile, insp } from '../../../../testsHelper';
import { ErrorsCodes } from '../../../../../src/Errors/ErrorsCodes';
import { expect, test } from '@jest/globals';

let pjs = runFile(import.meta.url, 'break_base.pas');

test('for loop -- base break test ', () => { 
    expect(pjs.getVarValue('a')).toBe(7);
});

test('while loop -- base break test ', () => { 
    expect(pjs.getVarValue('b')).toBe(8);
});

test('repeat loop -- base break test ', () => { 
    expect(pjs.getVarValue('c')).toBe(9);
});


