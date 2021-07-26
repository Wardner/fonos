import RabbitQConnector from "./rabbitq_connector";
export default class EventsSender extends RabbitQConnector {
    constructor(address: string[], q: string);
    sendToQ(payload: any): Promise<void>;
}
