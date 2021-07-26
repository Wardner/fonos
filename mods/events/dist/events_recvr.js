"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const rabbitq_connector_1 = __importDefault(require("./rabbitq_connector"));
const logger_1 = __importDefault(require("@fonos/logger"));
class EventsRecvr extends rabbitq_connector_1.default {
    constructor(address, q) {
        super(address, q);
    }
    watchEvents(func) {
        if (!this.channelWrapper) {
            throw `events.EventsClient.watchEvents [must connect to rabbitq before watching.]`;
        }
        this.channelWrapper.addSetup((channel) => {
            return Promise.all([
                channel.consume(this.q, (msg) => {
                    logger_1.default.log("debug", `events.EventsClient.watchEvents [new event on q => ${this.q}, payload ${msg.content.toString()}]`);
                    func(msg.content);
                }, { noAck: true, exclusive: false })
            ]);
        });
    }
}
exports.default = EventsRecvr;
