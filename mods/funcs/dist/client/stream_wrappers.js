"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LogsStream = exports.DeployStream = void 0;
class DeployStream {
    constructor(stream) {
        this.stream = stream;
    }
    onMessage(callback) {
        this.stream.on("data", (data) => {
            callback({ text: data.getText() });
        });
    }
    onFinish(callback) {
        this.stream.on("end", () => {
            callback();
        });
    }
    onError(callback) {
        this.stream.on("error", (e) => {
            callback(e);
        });
    }
}
exports.DeployStream = DeployStream;
class LogsStream {
    constructor(stream) {
        this.stream = stream;
    }
    onMessage(callback) {
        this.stream.on("data", (data) => {
            callback({
                name: data.getName(),
                instance: data.getInstance(),
                timestamp: data.getTimestamp(),
                text: data.getText()
            });
        });
    }
    onFinish(callback) {
        this.stream.on("end", () => {
            callback();
        });
    }
    onError(callback) {
        this.stream.on("error", (e) => {
            callback(e);
        });
    }
}
exports.LogsStream = LogsStream;
