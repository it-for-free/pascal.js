import { config as defaultConfig} from '../../../src/PascalJs/demoConfig';

export class OneVarOutputStream {
    constructor() {
      this.value = '';
    }
  
    write(str) {
      this.value += str; 
    }
  }

export const TESTING_NEW_LINE_SYMBOL = '!!!'; // or as usual \n
  
export const getOneVarOutputStreamConfig = () =>  {
  
  return {
    ...defaultConfig,
    outputStream: new OneVarOutputStream(),
    ouputNewLineSymbol: TESTING_NEW_LINE_SYMBOL,
  }
};