import { Verb } from "../verb";
export default class HangupVerb extends Verb {
    run(): Promise<void>;
}
