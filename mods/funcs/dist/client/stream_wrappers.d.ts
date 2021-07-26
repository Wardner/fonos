export declare class DeployStream {
    stream: any;
    constructor(stream: any);
    onMessage(callback: any): void;
    onFinish(callback: any): void;
    onError(callback: any): void;
}
export declare class LogsStream {
    stream: any;
    constructor(stream: any);
    onMessage(callback: any): void;
    onFinish(callback: any): void;
    onError(callback: any): void;
}
