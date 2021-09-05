
import { ErrorsCodes } from '../../../../../src/Errors/ErrorsCodes';
import { expect, test } from '@jest/globals';
import { runFile } from 'tests/helpers/testsHelper';

let pjs = runFile(import.meta.url, 'break_out_of_loop.pas', true);

test('get break out of loop exception', () => {
    // insp(pjs.error.errorCode, 'errorCode');  
    expect(pjs.error.errorCode).toBe(ErrorsCodes.breakOutOfLoop);
});


