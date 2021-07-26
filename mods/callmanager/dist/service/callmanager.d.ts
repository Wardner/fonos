import grpc from "grpc";
import { CallRequest, CallResponse } from "./protos/callmanager_pb";
import { ICallManagerServer } from "./protos/callmanager_grpc_pb";
declare class CallManagerServer implements ICallManagerServer {
    call(call: grpc.ServerUnaryCall<CallRequest>, callback: grpc.sendUnaryData<CallResponse>): Promise<void>;
}
export { CallManagerServer as default, ICallManagerServer, CallManagerServer };
