"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable require-jsdoc */
const numbers_pb_1 = __importDefault(require("./protos/numbers_pb"));
function default_1(jsonObj) {
    const number = new numbers_pb_1.default.Number();
    const location = jsonObj.spec.location;
    const ingressInfo = new numbers_pb_1.default.IngressInfo();
    ingressInfo.setWebhook(jsonObj.metadata.webhook);
    ingressInfo.setAccessKeyId(jsonObj.metadata.accessKeyId);
    number.setRef(jsonObj.metadata.ref);
    number.setProviderRef(jsonObj.metadata.gwRef);
    number.setIngressInfo(ingressInfo);
    number.setAorLink(location.aorLink);
    number.setCreateTime(jsonObj.metadata.createdOn);
    number.setUpdateTime(jsonObj.metadata.modifiedOn);
    number.setE164Number(location.telUrl.split(":")[1]);
    return number;
}
exports.default = default_1;
