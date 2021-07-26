import { GatherOptions } from "./types";
declare const waitForDtmf: (sessionId: string, options: GatherOptions) => Promise<string>;
export default waitForDtmf;
