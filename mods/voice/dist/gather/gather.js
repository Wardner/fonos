"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const deepmerge_1 = __importDefault(require("deepmerge"));
const asserts_1 = require("../asserts");
const verb_1 = require("../verb");
const asserts_2 = require("./asserts");
const source_dtmf_1 = __importDefault(require("./source_dtmf"));
const source_speech_1 = __importDefault(require("./source_speech"));
const logger_1 = __importDefault(require("@fonos/logger"));
const defaultOptions = {
    timeout: 4000,
    finishOnKey: "#",
    source: "dtmf"
};
class GatherVerb extends verb_1.Verb {
    constructor(request, speechProvider) {
        super(request);
        this.speechProvider = speechProvider;
    }
    async run(opts) {
        const options = deepmerge_1.default(defaultOptions, opts);
        asserts_2.assertsHasNumDigitsOrTimeout(options);
        // assertsValuesIsZeroOrGreater("timeout", options.timeout);
        asserts_1.assertsValueIsPositive("numDigits", options.numDigits);
        asserts_1.assertsFinishOnKeyIsChar(options.finishOnKey);
        if (options.source.includes("speech"))
            options.timeout = 10000;
        return new Promise(async (resolve, reject) => {
            if (options.source.includes("dtmf")) {
                logger_1.default.verbose("@fonos/voice enabled dtmf source");
                source_dtmf_1.default(this.request.sessionId, options)
                    .then((text) => {
                    resolve(text);
                    logger_1.default.verbose("@fonos/voice result resolved from dtmf source");
                })
                    .catch((e) => {
                    reject(e);
                });
            }
            // TODO: We should explicitly clean this resources if the other "source"
            // already resolved the request.
            if (options.source.includes("speech")) {
                logger_1.default.verbose("@fonos/voice enabled speech source");
                source_speech_1.default(this.request.sessionId, options, super.getSelf(), this.speechProvider)
                    .then((text) => {
                    resolve(text);
                    logger_1.default.verbose("@fonos/voice result resolved from speech source");
                })
                    .catch((e) => {
                    reject(e);
                });
            }
        });
    }
}
exports.default = GatherVerb;
