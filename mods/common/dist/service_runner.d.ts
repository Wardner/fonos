interface ServiceInf {
    name: string;
    version: string;
    service: unknown;
    server: unknown;
}
interface Middleware {
    name: string;
    description?: string;
    middlewareObj: any;
}
export default function run(srvInfList: ServiceInf[], middlewareList?: Middleware[]): void;
export {};
