"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GoogleSpeechTracker = void 0;
const defaultTrackerConfig = {
    config: {
        encoding: "LINEAR16",
        sampleRateHertz: 16000,
        languageCode: "en-US"
    },
    interimResults: false
};
class GoogleSpeechTracker {
    constructor(config) {
        const speech = require("@google-cloud/speech");
        this.client = new speech.SpeechClient();
        const merge = require("deepmerge");
        this.config = merge(defaultTrackerConfig, { config } || {});
    }
    transcribe(stream) {
        return new Promise((resolve, reject) => {
            const recognizeStream = this.client
                .streamingRecognize(this.config)
                .on("error", (e) => reject(e))
                .on("data", (data) => {
                if (data.results[0] && data.results[0].alternatives[0]) {
                    const result = {
                        transcription: data.results[0].alternatives[0].transcript
                    };
                    resolve(result);
                    return;
                }
            });
            stream.pipe(recognizeStream);
        });
    }
}
exports.GoogleSpeechTracker = GoogleSpeechTracker;
