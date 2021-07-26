"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendCallRequest = exports.attachToEvents = void 0;
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
const auth_1 = __importDefault(require("@fonos/auth"));
const storage_1 = __importDefault(require("@fonos/storage"));
const axios_1 = __importDefault(require("axios"));
const logger_1 = __importDefault(require("@fonos/logger"));
const ws_1 = __importDefault(require("ws"));
const udp_media_receiver_1 = __importDefault(require("./udp_media_receiver"));
const attachToDtmfReceived = (ws, channel) => {
    logger_1.default.verbose(`@fonos/dispatcher attaching to dtmf received event`);
    channel.on("ChannelDtmfReceived", (event, channel) => {
        logger_1.default.debug(`@fonos/dispatcher sending dtmf event [digit: ${event.digit}, channel=${channel.id}]`);
        if (ws.readyState !== ws_1.default.OPEN) {
            logger_1.default.warn(`@fonos/dispatcher ignoring socket request on lost connection`);
            return;
        }
        ws.send(JSON.stringify({
            type: "DtmfReceived",
            sessionId: channel.id,
            data: event.digit
        }));
    });
};
const attachToPlaybackFinished = (ws, client, sessionId) => {
    logger_1.default.verbose(`@fonos/dispatcher attaching to playback finished event`);
    client.on("PlaybackFinished", (event, playback) => {
        logger_1.default.verbose(`@fonos/dispatcher sending playback finished event [playbackId: ${playback.id}]`);
        if (ws.readyState !== ws_1.default.OPEN) {
            logger_1.default.warn(`@fonos/dispatcher ignoring socket request on lost connection`);
            return;
        }
        ws.send(JSON.stringify({
            type: "PlaybackFinished",
            sessionId,
            data: playback.id
        }));
    });
};
const attachToSendExternalMedia = (ws, client, sessionId, udpServer, address) => {
    logger_1.default.verbose(`@fonos/dispatcher sending udp to external receiver`);
    client.on("ChannelUserevent", async (event) => {
        logger_1.default.debug(`@fonos/dispatcher send external media`);
        if (ws.readyState !== ws_1.default.OPEN) {
            logger_1.default.warn(`@fonos/dispatcher ignoring socket request on lost connection`);
            return;
        }
        const bridge = client.Bridge();
        bridge.on("BridgeDestroyed", (event) => {
            // Do something with this!
        });
        await bridge.create({ type: "mixing" });
        bridge.addChannel({ channel: sessionId });
        const externalChannel = client.Channel();
        externalChannel.on("StasisStart", (event, chan) => {
            bridge.addChannel({ channel: chan.id });
        });
        externalChannel.on("StasisEnd", (event, chan) => { });
        udpServer.getServer().on("data", (data) => {
            ws.send(Buffer.concat([Buffer.from(sessionId), data]));
        });
        await externalChannel.externalMedia({
            app: "mediacontroller",
            external_host: address,
            format: "slin16"
        });
    });
};
const uploadRecording = async (accessKeyId, filename) => {
    logger_1.default.verbose(`@fonos/dispatcher creating short-life token [accessKeyId=${accessKeyId}]`);
    const auth = new auth_1.default();
    const access = await auth.createToken({
        accessKeyId: accessKeyId
    });
    const storage = new storage_1.default({ accessKeyId, accessKeySecret: access.token });
    logger_1.default.verbose(`@fonos/dispatcher uploading file to storage subsystem [filename=${filename}]`);
    if (!process.env.RECORDINGS_PATH) {
        throw new Error("environment variable 'RECORDINGS_PATH' is not set");
    }
    await storage.uploadObject({
        // WARNING: Hardcoded value
        bucket: "recordings",
        filename: `${process.env.RECORDINGS_PATH}/${filename}`
    });
};
const attachToRecordingFinished = (ws, client, accessKeyId, sessionId) => {
    logger_1.default.verbose(`@fonos/dispatcher attaching to recording finished event`);
    client.on("RecordingFinished", async (event) => {
        logger_1.default.debug(`@fonos/dispatcher sending recording finished event [filename: ${event.recording.name}]`);
        if (ws.readyState !== ws_1.default.OPEN) {
            logger_1.default.warn(`@fonos/dispatcher ignoring socket request on lost connection`);
            return;
        }
        ws.send(JSON.stringify({
            type: "RecordingFinished",
            sessionId,
            data: {
                name: event.recording.name,
                duration: event.recording.duration,
                format: event.recording.format,
                silenceDuration: event.recording.silence_duration,
                talkingDuration: event.recording.talking_duration
            }
        }));
        await uploadRecording(accessKeyId, event.recording.name);
    });
};
const attachToRecordingFailed = (ws, client, sessionId) => {
    logger_1.default.verbose(`@fonos/dispatcher attaching to recording failed event `);
    client.on("RecordingFailed", (event) => {
        logger_1.default.debug(`@fonos/dispatcher sending recording failed event [filename: ${event.recording.name}]`);
        ws.send(JSON.stringify({
            type: "RecordingFailed",
            sessionId,
            data: {
                cause: event.recording.cause
            }
        }));
    });
};
const attachToEvents = (request) => {
    logger_1.default.verbose(`@fonos/dispatcher connecting websocket @ mediacontroller`);
    const wsClient = new ws_1.default(request.url);
    const getRandomPort = () => Math.floor(Math.random() * (6000 - 5060)) + 10000;
    const address = `0.0.0.0:${getRandomPort()}`;
    // WARNING: Harcoded address
    const udpServer = new udp_media_receiver_1.default(address, true);
    wsClient.on("open", () => {
        attachToDtmfReceived(wsClient, request.channel);
        attachToSendExternalMedia(wsClient, request.client, request.sessionId, udpServer, address);
        attachToPlaybackFinished(wsClient, request.client, request.sessionId);
        attachToRecordingFinished(wsClient, request.client, request.accessKeyId, request.sessionId);
        attachToRecordingFailed(wsClient, request.client, request.sessionId);
    });
    wsClient.on("close", () => {
        wsClient.terminate();
        logger_1.default.verbose(`@fonos/dispatcher closing broken connection [sessionId = ${request.sessionId}]`);
    });
    wsClient.on("error", () => {
        logger_1.default.verbose(`@fonos/dispatcher unable to connect to voice app [url = ${request.url}, hanging up call]`);
        request.channel.hangup();
    });
};
exports.attachToEvents = attachToEvents;
const sendCallRequest = async (url, request) => {
    try {
        const response = await axios_1.default.post(url, request);
        logger_1.default.verbose(`@fonos/dispatcher mediacontroller [response = ${response.data ? response.data.data : "no response"}]`);
    }
    catch (e) {
        logger_1.default.error(`Unable to send request to voice app at [url = ${url}]`);
    }
};
exports.sendCallRequest = sendCallRequest;
