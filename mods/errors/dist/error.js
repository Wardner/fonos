"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const codes_1 = require("./codes");
class default_1 extends Error {
    constructor(message, code = codes_1.UNKNOWN) {
        super(message);
        this.name = "FonosError";
        this.code = code;
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, this.constructor);
        }
    }
}
exports.default = default_1;
