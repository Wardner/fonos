"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const rabbitq_connector_1 = __importDefault(require("./rabbitq_connector"));
const logger_1 = __importDefault(require("@fonos/logger"));
class EventsSender extends rabbitq_connector_1.default {
    constructor(address, q) {
        super(address, q);
    }
    async sendToQ(payload) {
        if (process.env.EVENTS_ENABLED !== "true") {
            logger_1.default.verbose("@fonos/events rabbitq connector [ignoring event: events service is disabled]");
            return;
        }
        logger_1.default.verbose(`events.EventsSender.sendToQ [sent message to q => ${this.q}]`);
        await this.channelWrapper.sendToQueue(this.q, {
            data: payload
        });
    }
}
exports.default = EventsSender;
