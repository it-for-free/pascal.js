
import { runFile } from 'tests/helpers/testsHelper';
import { expect, test } from '@jest/globals';

let pjs = runFile(import.meta.url, 'char_assignation_base.pas');

test(`char assignation base `, () => { 
    expect(pjs.getVarValue('a')).toBe('B');
});




