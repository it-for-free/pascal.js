import { ListingOutput } from "../IO/Output/types";

export interface PascalJsConfig {
    ouputNewLineSymbol: string;
    outputStream: BaseOutputStream;
    listingOutput: ListingOutput;
}

interface BaseOutputStream {
    write: Function;
}