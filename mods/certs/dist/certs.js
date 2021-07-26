"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AUTH_ISS = exports.ACCESS_KEY_ID = exports.PATH_TO_CONFIG = exports.PATH_TO_SALT = exports.saltExist = exports.configExist = exports.getSalt = exports.createClientConfig = exports.createServerConfig = exports.default = void 0;
const fs_1 = __importDefault(require("fs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const acme_client_1 = require("acme-client");
const path_1 = require("path");
const os_1 = require("os");
const btoa_1 = __importDefault(require("btoa"));
const BASE_DIR = path_1.join(os_1.homedir(), ".fonos");
const PATH_TO_SALT = path_1.join(BASE_DIR, "jwt.salt");
exports.PATH_TO_SALT = PATH_TO_SALT;
const PATH_TO_CONFIG = path_1.join(BASE_DIR, "config");
exports.PATH_TO_CONFIG = PATH_TO_CONFIG;
const ACCESS_KEY_ID = process.env.ACCESS_KEY_ID || "fonos";
exports.ACCESS_KEY_ID = ACCESS_KEY_ID;
const AUTH_ISS = process.env.AUTH_ISS || "fonos";
exports.AUTH_ISS = AUTH_ISS;
const getContent = (workdir, file) => btoa_1.default(fs_1.default.readFileSync(`${workdir}/${file}`).toString("utf-8"));
if (!fs_1.default.existsSync(BASE_DIR))
    fs_1.default.mkdirSync(BASE_DIR);
const getSalt = () => fs_1.default.readFileSync(PATH_TO_SALT).toString().trim();
exports.getSalt = getSalt;
const configExist = () => fs_1.default.existsSync(PATH_TO_CONFIG);
exports.configExist = configExist;
const saltExist = () => fs_1.default.existsSync(PATH_TO_SALT);
exports.saltExist = saltExist;
async function createAccessFile() {
    if (!saltExist()) {
        fs_1.default.writeFileSync(PATH_TO_SALT, await acme_client_1.forge.createPrivateKey());
    }
    const salt = getSalt();
    const claims = { AUTH_ISS, sub: ACCESS_KEY_ID };
    const config = {
        accessKeyId: ACCESS_KEY_ID,
        accessKeySecret: jsonwebtoken_1.default.sign(claims, salt)
    };
    fs_1.default.writeFileSync(PATH_TO_CONFIG, JSON.stringify(config, null, " "));
    return config;
}
exports.default = createAccessFile;
const writeConfig = (config, pathToConfig, workdir) => {
    const content = JSON.stringify(config, null, "");
    if (!fs_1.default.existsSync(workdir))
        fs_1.default.mkdirSync(workdir, { recursive: true });
    fs_1.default.writeFileSync(pathToConfig, content);
};
function createServerConfig(workdir) {
    try {
        const pathToConfig = path_1.join(workdir, "config");
        const config = JSON.parse(fs_1.default.readFileSync(pathToConfig).toString("utf-8"));
        config.caCertificate = getContent(workdir, "ca.crt");
        config.serverCertificate = getContent(workdir, "server.crt");
        config.serverKey = getContent(workdir, "server.key");
        writeConfig(config, pathToConfig, workdir);
    }
    catch (e) {
        console.error(e);
    }
}
exports.createServerConfig = createServerConfig;
function createClientConfig(workdir) {
    try {
        const pathToConfig = path_1.join(workdir, "config");
        const config = JSON.parse(fs_1.default.readFileSync(pathToConfig).toString("utf-8"));
        config.caCertificate = getContent(workdir, "ca.crt");
        config.clientCertificate = getContent(workdir, "client.crt");
        config.clientKey = getContent(workdir, "client.key");
        writeConfig(config, pathToConfig, workdir);
    }
    catch (e) {
        console.error(e);
    }
}
exports.createClientConfig = createClientConfig;
