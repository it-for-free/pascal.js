import { fileURLToPath } from 'url';
import { dirname } from 'path';
import util from 'util';
import { FileIO, ConsoleOutput, LexicalAnalyzer, 
    SyntaxAnalyzer, Engine,  PascalJs   } from '../../src/pascal.js';
import { config as defaultConfig } from '../../src/PascalJs/demoConfig';    

export function getFullPath(ImportMetaUrlData, fileName) {
    const __filename = fileURLToPath(ImportMetaUrlData);
    return dirname(__filename) + '/' + fileName;
}

/**
 * Распечатывает значения для отладки (с произвольной вложенностью)
 * 
 * @param {*} data 
 */
export function insp(data, comment = '') {
    console.log('⚑', comment,  util.inspect(data, 
        {showHidden: false, depth: null}));
}

/**
 * 
 * @param {*} ImportMetaUrlData 
 * @param {string} fileName 
 * @param {boolean} ignoreInnerError=false is interpreter error expected
 * @returns {PascalJs} 
 */
export function runFile(ImportMetaUrlData, fileName, ignoreInnerError = false, config = null) {

    if (!config) {
        config = defaultConfig;
    }
    
    let PJS = new PascalJs(config);
    PJS.runFile(getFullPath(ImportMetaUrlData, fileName));

    if (!ignoreInnerError  && PJS.error) {
        throw PJS.error;
    }
    return PJS;
}
