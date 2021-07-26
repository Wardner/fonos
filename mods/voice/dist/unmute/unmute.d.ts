import { Verb } from "../verb";
import { MuteOptions } from "./types";
export default class UnmuteVerb extends Verb {
    run(opts?: MuteOptions): Promise<void>;
}
export { MuteOptions };
