
import { ConsoleOutput } from "../IO/Output/ConsoleOutput";
import { PascalJsConfig } from "./types";

export const config: PascalJsConfig = {
    outputStream: process.stdout,
    ouputNewLineSymbol: "\n",
    listingOutput: new ConsoleOutput(),
};