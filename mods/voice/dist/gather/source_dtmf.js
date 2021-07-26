"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const pubsub_js_1 = __importDefault(require("pubsub-js"));
const waitForDtmf = async (sessionId, options) => new Promise(async (resolve, reject) => {
    let token = null;
    try {
        let timer;
        let digits = "";
        if (options.timeout > 0) {
            timer = setTimeout(() => {
                resolve(digits);
                pubsub_js_1.default.unsubscribe(token);
                return;
            }, options.timeout);
        }
        const token = pubsub_js_1.default.subscribe(`DtmfReceived.${sessionId}`, (type, data) => {
            const key = data.data;
            if (timer) {
                clearTimeout(timer);
                timer = setTimeout(() => {
                    resolve(digits);
                    pubsub_js_1.default.unsubscribe(token);
                    return;
                }, options.timeout);
            }
            // We don't need to include finishOnKey
            if (options.finishOnKey != key) {
                digits += key;
            }
            if (digits.length >= options.numDigits ||
                key === options.finishOnKey) {
                resolve(digits);
                pubsub_js_1.default.unsubscribe(token);
                return;
            }
        });
    }
    catch (e) {
        reject(e);
        pubsub_js_1.default.unsubscribe(token);
    }
});
exports.default = waitForDtmf;
