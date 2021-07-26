/// <reference types="node" />
import fs from "fs";
export default class UDPMediaReceiver {
    server: any;
    swap16: boolean;
    alsoWritePath: string;
    address: string;
    port: number;
    fileStream: fs.WriteStream;
    constructor(host: string, swap16?: boolean, alsoWritePath?: string);
    getServer(): any;
}
