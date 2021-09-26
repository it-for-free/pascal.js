
import { runFile } from 'tests/helpers/testsHelper';
import { expect, test } from '@jest/globals';

let pjs = runFile(import.meta.url, 'for_by_char.pas');

test(`for loop by char "for c := 'A' to 'Z'" `, () => { 
    expect(pjs.getVarValue('a')).toBe('Z');
});
test(`for loop by char "for c := 'a' to 'E'"`, () => { 
    expect(pjs.getVarValue('b')).toBe('e');
});
test(`for loop by char "for  c := 'E' to 'g'"`, () => { 
    expect(pjs.getVarValue('d')).toBe('g');
});
test(`for loop by char  "for c := 'Z' downto 'A' do"`, () => { 
    expect(pjs.getVarValue('e')).toBe('A');
});



