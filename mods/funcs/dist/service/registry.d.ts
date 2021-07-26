import { ServerStream } from "./funcs";
export interface BuildInfo {
    image: string;
    pathToFunc: string;
    registry: string;
    username?: string;
    secret?: string;
    token?: string;
}
export default function (request: BuildInfo, serverStream: ServerStream): Promise<void>;
