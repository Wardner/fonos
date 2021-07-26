import { CallRequest, CallResponse } from "./protos/callmanager_pb";
import { EndpointInfo } from "../client/types";
export default function (request: CallRequest, channel: any, endpointInfo: EndpointInfo): Promise<CallResponse>;
