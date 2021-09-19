
import { runFile } from 'tests/helpers/testsHelper';
import { expect, test } from '@jest/globals';

let pjs = runFile(import.meta.url, 'custom_type_base.pas');

test(`a=2 `, () => { 
    expect(pjs.getVarValue('a')).toBe(2);
});




