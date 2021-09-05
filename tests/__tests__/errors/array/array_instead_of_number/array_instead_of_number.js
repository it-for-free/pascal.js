import { expect, test } from '@jest/globals';
import { runFile } from 'tests/helpers/testsHelper';
import { ErrorsCodes } from '../../../../../src/Errors/ErrorsCodes';


let pjs = runFile(import.meta.url, 'array_instead_of_number.pas', true);

test('get error', () => {
  // insp(pjs.error.errorCode, 'errorCode');  
  expect(pjs.getError().errorCode).toBe(ErrorsCodes.typesMismatch); 
});


