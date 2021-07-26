"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventsSender = exports.EventsRecvr = void 0;
const events_sender_1 = __importDefault(require("./events_sender"));
exports.EventsSender = events_sender_1.default;
const events_recvr_1 = __importDefault(require("./events_recvr"));
exports.EventsRecvr = events_recvr_1.default;
