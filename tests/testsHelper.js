import { fileURLToPath } from 'url';
import { dirname } from 'path';
import util from 'util';

export function getFullPath(ImportMetaUrlData, fileName) {
    const __filename = fileURLToPath(ImportMetaUrlData);
    return dirname(__filename) + '/' + fileName;
}

export function insp(data) {
    console.log(util.inspect(data, 
        {showHidden: false, depth: null})
    );
}