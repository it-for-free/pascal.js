
import { runFile } from 'tests/helpers/testsHelper';
import { expect, test } from '@jest/globals';
import { ErrorsCodes } from 'src/Errors/ErrorsCodes';

let pjs = runFile(import.meta.url, 'constants_change_error_base.pas', true);
// insp(engine.scopes);

test('get error', () => {
  expect(pjs.getError().errorCode).toBe(ErrorsCodes.variableNotDeclared);
});

