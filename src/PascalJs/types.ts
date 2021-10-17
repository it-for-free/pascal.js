export interface PascalJsConfig {
    ouputNewLineSymbol: string;
    outputStream: BaseOutputStream;
}

interface BaseOutputStream {
    write: Function;
}