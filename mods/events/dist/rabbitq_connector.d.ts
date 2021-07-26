export default class RabbitQConnector {
    address: string[];
    channelWrapper: any;
    q: string;
    constructor(address: string[], q: string);
    connect(): void;
}
