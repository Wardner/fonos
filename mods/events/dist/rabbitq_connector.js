"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const amqp_connection_manager_1 = __importDefault(require("amqp-connection-manager"));
const logger_1 = __importDefault(require("@fonos/logger"));
class RabbitQConnector {
    constructor(address, q) {
        this.address = address;
        this.q = q;
    }
    connect() {
        if (process.env.EVENTS_ENABLED !== "true") {
            logger_1.default.info("@fonos/events rabbitq connector [disabled]");
            return;
        }
        logger_1.default.info("@fonos/events rabbitq connector [connecting to rabbitq]");
        const connection = amqp_connection_manager_1.default.connect(this.address);
        this.channelWrapper = connection.createChannel({
            json: true,
            setup: (channel) => {
                logger_1.default.info(`@fonos/events rabbitq connector [setting up q => ${this.q}, durable => false]`);
                return channel.assertQueue(this.q, { durable: false });
            }
        });
    }
}
exports.default = RabbitQConnector;
