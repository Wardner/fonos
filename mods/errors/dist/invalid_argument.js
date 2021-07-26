"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const error_1 = __importDefault(require("./error"));
const codes_1 = require("./codes");
class default_1 extends error_1.default {
    constructor(message) {
        super(message, codes_1.INVALID_ARGUMENT);
        this.name = "FonosInvalidArgument";
    }
}
exports.default = default_1;
