import { fileURLToPath } from 'url';
import { dirname } from 'path';
import util from 'util';
import {  PascalJs   } from '../../src/pascal';
import { config as defaultConfig } from '../../src/PascalJs/demoConfig';    
import { StringOutput } from 'src/IO/Output/StringOutput';
import fs from 'fs';

export function getFullPath(ImportMetaUrlData, fileName) {
    const __filename = fileURLToPath(ImportMetaUrlData);
    return dirname(__filename) + '/' + fileName;
}

export function getFileContent(ImportMetaUrlData, fileName) {
    return fs.readFileSync(getFullPath(ImportMetaUrlData, fileName), 'utf-8');
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

    if (!ignoreInnerError && PJS.error) {
        throw PJS.error;
    }
    return PJS;
}

export function runString(programText: string, ignoreInnerError = false, config = null) {

    if (!config) {
        config = { 
            ...defaultConfig,
            listingOutput: new StringOutput(),
        };
    }
    
    let PJS = new PascalJs(config);
    PJS.runString(programText);

    if (!ignoreInnerError && PJS.error) {
        throw PJS.error;
    }
    return PJS;
}
