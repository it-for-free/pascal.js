
import { runFile, insp } from '../../../../testsHelper';
import { config as defaultConfig} from '../../../../../src/PascalJs/demoConfig';

class MyOutputStream {
  constructor() {
    this.value = '';
  }

  write(str) {
    this.value += str; 
  }
}

let output = new MyOutputStream();
let ouputNewLineSymbol = '!!!'; // or as usual \n
const config = {
  ...defaultConfig,
  outputStream: output,
  ouputNewLineSymbol,
};

// insp(config);

let pjs = runFile(import.meta.url, 'custom_output_stream_base.pas', false, config);
// insp(pjs.engine.tree);

test("check custom output stream saves data", () => {
  expect(output.value).toBe('write1 77writeln 77' + ouputNewLineSymbol);
});


