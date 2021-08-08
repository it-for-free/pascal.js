import { Interface } from "readline";
import { RuntimeError } from "../RuntimeError";

interface RuntimeErrorType extends Error {
    errorCode: number;
    errorText: number;
    textPosition
};