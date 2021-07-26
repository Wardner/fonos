import { Verb } from "../verb";
import { RecordOptions, RecordResult } from "./types";
export default class RecordVerb extends Verb {
    run(options?: RecordOptions): Promise<RecordResult>;
}
export { RecordOptions, RecordResult };
