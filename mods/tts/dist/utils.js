"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.optionsToQueryString = exports.transcode = exports.computeFilename = void 0;
const crypto_1 = __importDefault(require("crypto"));
/**
 * Uses the input text and options to generate a filename. This is
 * later used to cache a file generated by a TTS engine.
 *
 * @param {string} - the text to synthetize
 * @param {object} - json object with configuration for the TTS engine
 * @param {sting} - resulting format. Defaults to '.wav'
 * @returns {string} compute filename
 */
const computeFilename = (text, options = {}, format = "wav") => {
    const flat = require("flat");
    let c = text;
    if (options.cachingFields) {
        const flatObj = flat(options);
        c = options.cachingFields
            .map((opt) => flatObj[opt])
            .sort()
            .join();
    }
    return (crypto_1.default.createHash("md5").update(`${text},${c}`).digest("hex") + "." + format);
};
exports.computeFilename = computeFilename;
/**
 * Takes a json object and creates a query formatted string
 *
 * @param {object} - a one level json object with the synth options
 * @returns {string} a string with the format like 'key=value&'
 */
const optionsToQueryString = (obj) => Object.keys(obj)
    .map((key) => `${key}=${obj[key].toString()}`)
    .join("&");
exports.optionsToQueryString = optionsToQueryString;
/**
 * Gets the path to a file as input and transcode to
 * a new format compatible with Asterisk
 *
 * @param {string} fileIn - path to original file which is expected to be .wav
 * @param {string} fileOut - path resulting file in a format understod by asterisk
 * @returns {Promise<string>} path to the resulting file
 */
const transcode = (fileIn, fileOut) => new Promise((resolve, reject) => {
    // We need a new instance to avoid collisions
    const sox = require("sox-audio")();
    sox.on("error", (err, stdout, stderr) => reject(`Cannot process audio: ${err.message}`));
    sox.input(fileIn);
    // TODO: Investigate other formats that can produce a better audio quality
    sox.output(fileOut).outputSampleRate(8000).outputFileType("wav");
    sox.run();
    sox.on("end", () => resolve(fileOut));
});
exports.transcode = transcode;