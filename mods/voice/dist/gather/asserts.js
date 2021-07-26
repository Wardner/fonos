"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.assertsHasNumDigitsOrTimeout = void 0;
const assertsHasNumDigitsOrTimeout = (options) => {
    if (!options.numDigits && !options.timeout) {
        throw new Error("you must provide either 'numDigits' or 'timeout' option");
    }
};
exports.assertsHasNumDigitsOrTimeout = assertsHasNumDigitsOrTimeout;
