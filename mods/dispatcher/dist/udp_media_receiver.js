"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/*
 * Copyright (C) 2021 by Fonoster Inc (https://fonoster.com)
 * http://github.com/fonoster/fonos
 *
 * This file is part of Project Fonos
 *
 * Licensed under the MIT License (the "License");
 * you may not use this file except in compliance with
 * the License. You may obtain a copy of the License at
 *
 *    https://opensource.org/licenses/MIT
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
const fs_1 = __importDefault(require("fs"));
const dgram_1 = __importDefault(require("dgram"));
const pipe = require("stream").prototype.pipe;
class UDPMediaReceiver {
    constructor(host, swap16, alsoWritePath) {
        this.server = dgram_1.default.createSocket("udp4");
        // Add the Stream.pipe() method to the socket
        this.server.pipe = pipe;
        this.swap16 = swap16 || false;
        this.alsoWritePath = alsoWritePath;
        this.address = host.split(":")[0];
        this.port = parseInt(host.split(":")[1]);
        if (this.alsoWritePath) {
            this.fileStream = fs_1.default.createWriteStream(this.alsoWritePath, {
                autoClose: true
            });
        }
        this.server.on("error", (err) => {
            console.log(`server error:\n${err.stack}`);
            this.server.close();
            if (this.fileStream) {
                this.fileStream.close();
            }
        });
        this.server.on("close", (err) => {
            console.log(`server socket closed`);
            if (this.fileStream) {
                this.fileStream.close();
            }
        });
        this.server.on("message", (msg, rinfo) => {
            /* Strip the 12 byte RTP header */
            let buf = msg.slice(12);
            if (this.swap16) {
                buf.swap16();
            }
            if (this.fileStream) {
                this.fileStream.write(buf);
            }
            this.server.emit("data", buf);
        });
        this.server.on("listening", () => {
            const address = this.server.address();
            console.log(`server listening ${address.address}:${address.port}`);
        });
        this.server.bind(this.port, this.address);
        //return this.server;
    }
    getServer() {
        return this.server;
    }
}
exports.default = UDPMediaReceiver;
