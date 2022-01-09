
import { runString, getFileContent } from 'tests/helpers/testsHelper';
import { expect, test } from '@jest/globals';

const programCode = getFileContent(import.meta.url, 'string_program_input.pas');
let pjs = runString(programCode);

// insp(engine.scopes);

test('a', () => {
  expect(pjs.getVarValue('a')).toBe(123); 
});

