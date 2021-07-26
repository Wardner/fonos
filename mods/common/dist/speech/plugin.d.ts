export declare abstract class Plugin {
    type: string;
    name: string;
    constructor(type: string, name: string);
    getType(): string;
}
