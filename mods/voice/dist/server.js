"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const voice_1 = __importDefault(require("./voice"));
const logger_1 = __importDefault(require("@fonos/logger"));
const express_1 = __importDefault(require("express"));
const path_1 = require("path");
const fs_1 = __importDefault(require("fs"));
const pubsub_js_1 = __importDefault(require("pubsub-js"));
const merge = require("deepmerge");
const app = express_1.default();
app.use(express_1.default.json());
require("express-ws")(app);
const defaultServerConfig = {
    base: "/",
    port: 3000,
    bind: "0.0.0.0",
    pathToFiles: "/tmp"
};
class VoiceServer {
    constructor(config = defaultServerConfig) {
        this.config = merge(defaultServerConfig, config);
        this.init();
        this.plugins = {};
    }
    /**
     * Add tts or asr plugin.
     *
     * @param plugin
     */
    use(plugin) {
        // Note: We only support registering one plugin per type
        this.plugins[plugin.getType()] = plugin;
    }
    listen(handler, port = this.config.port) {
        app.get(`${this.config.base}/tts/:file`, (req, res) => {
            // TODO: Update to use a stream instead of fs.readFile
            fs_1.default.readFile(path_1.join(this.config.pathToFiles, req.params.file), function (err, data) {
                if (err) {
                    res.send("unable to find or open file");
                }
                else {
                    // TODO: Set this value according to file extension
                    res.setHeader("content-type", "audio/x-wav");
                    res.send(data);
                }
                res.end();
            });
        });
        app.post(this.config.base, async (req, res) => {
            const response = new voice_1.default(req.body);
            response.plugins = this.plugins;
            await handler(req.body, response);
            res.end();
        });
        logger_1.default.info(`starting voice server on @ ${this.config.bind}, port=${this.config.port}`);
        app.listen(port, this.config.bind);
    }
    init() {
        logger_1.default.info(`initializing voice server`);
        app.ws(this.config.base, (ws) => {
            ws.on("message", (msg) => {
                if (Buffer.isBuffer(msg)) {
                    const sessionId = msg.toString("utf-8", 0, 12);
                    const mediaData = msg.slice(12);
                    pubsub_js_1.default.publish(`media.${sessionId}`, mediaData);
                }
                else {
                    const event = JSON.parse(msg);
                    pubsub_js_1.default.publish(`${event.type}.${event.sessionId}`, event);
                    logger_1.default.verbose("@fonos/voice received event => ", event);
                }
            }).on("error", console.error);
        });
    }
}
exports.default = VoiceServer;
