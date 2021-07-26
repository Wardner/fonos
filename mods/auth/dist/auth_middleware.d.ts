export default class AuthMiddleware {
    privateKey: string;
    whitelist: string[];
    constructor(privateKey: string, whitelist?: any[]);
    middleware: (ctx: any, next: any, errorCb: any) => Promise<void>;
}
