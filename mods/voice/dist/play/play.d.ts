import { Verb } from "../verb";
import { PlayOptions } from "./types";
export default class PlayVerb extends Verb {
    run(media: string, options?: PlayOptions): Promise<void>;
}
export { PlayOptions };
