import { ServerConfig } from "./types";
import { Plugin } from "@fonos/common";
export default class VoiceServer {
    config: ServerConfig;
    plugins: {};
    constructor(config?: ServerConfig);
    /**
     * Add tts or asr plugin.
     *
     * @param plugin
     */
    use(plugin: Plugin): void;
    listen(handler: Function, port?: number): void;
    init(): void;
}
