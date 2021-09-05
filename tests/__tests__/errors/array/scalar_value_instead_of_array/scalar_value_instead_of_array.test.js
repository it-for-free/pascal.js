import { expect, test } from '@jest/globals';
import { ErrorsCodes } from 'src/Errors/ErrorsCodes';
import { runFile } from 'tests/helpers/testsHelper';

let pjs = runFile(import.meta.url, 'scalar_value_instead_of_array.pas', true);

test('get error', () => {
  // insp(pjs.error.errorCode, 'errorCode');  
  expect(pjs.getError().errorCode).toBe(ErrorsCodes.typesMismatch);
});





