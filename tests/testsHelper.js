import { fileURLToPath } from 'url';
import { dirname } from 'path';
import util from 'util';
import { FileIO, ConsoleOutput, LexicalAnalyzer, 
    SyntaxAnalyzer, Engine,  PascalJs   } from '../src/pascal.js';

export function getFullPath(ImportMetaUrlData, fileName) {
    const __filename = fileURLToPath(ImportMetaUrlData);
    return dirname(__filename) + '/' + fileName;
}

/**
 * Распечатывает значения для отладки (с произвольной вложенностью)
 * 
 * @param {mixed} data 
 */
export function insp(data, comment = '') {
    console.log('⚑', comment,  util.inspect(data, 
        {showHidden: false, depth: null}));
}

/**
 * 
 * @param {*} ImportMetaUrlData 
 * @param {string} fileName 
 * @param {boolean} ignoreInnerError is interpreter error expected
 * @returns {PascalJs} 
 */
export function runFile(ImportMetaUrlData, fileName, ignoreInnerError = false) {

    let PJS = new PascalJs();
    PJS.runFile(getFullPath(ImportMetaUrlData, fileName));

    if (!ignoreInnerError  && PJS.error) {
        throw PJS.error;
    }
    return PJS;
}
