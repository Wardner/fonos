import RabbitQConnector from "./rabbitq_connector";
export default class EventsRecvr extends RabbitQConnector {
    constructor(address: string[], q: string);
    watchEvents(func: Function): void;
}
