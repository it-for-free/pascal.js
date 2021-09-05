import { expect, test } from '@jest/globals';
import { ErrorsCodes } from '../../../../../src/Errors/ErrorsCodes';
import { runFile } from '../../../../testsHelper';


let pjs = runFile(import.meta.url, 'array_instead_of_number.pas', true);

test('get error', () => {
  // insp(pjs.error.errorCode, 'errorCode');  
  expect(pjs.getError().errorCode).toBe(ErrorsCodes.typesMismatch); 
});


