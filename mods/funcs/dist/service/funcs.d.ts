import grpc, { ServerWritableStream } from "grpc";
import { Empty } from "./protos/common_pb";
import { IFuncsServer } from "./protos/funcs_grpc_pb";
import { CreateRegistryTokenRequest, CreateRegistryTokenResponse, DeployFuncRequest, DeployStream, DeleteFuncRequest, Func, FuncLog, GetFuncLogsRequest, GetFuncRequest, ListFuncsRequest, ListFuncsResponse } from "./protos/funcs_pb";
export declare class ServerStream {
    call: any;
    constructor(call: any);
    write(message: string): void;
}
export default class FuncsServer implements IFuncsServer {
    listFuncs(call: grpc.ServerUnaryCall<ListFuncsRequest>, callback: grpc.sendUnaryData<ListFuncsResponse>): Promise<void>;
    getFunc(call: grpc.ServerUnaryCall<GetFuncRequest>, callback: grpc.sendUnaryData<Func>): Promise<void>;
    deployFunc(call: ServerWritableStream<DeployFuncRequest, DeployStream>): Promise<void>;
    deleteFunc(call: grpc.ServerUnaryCall<DeleteFuncRequest>, callback: grpc.sendUnaryData<Empty>): Promise<void>;
    getFuncLogs(call: ServerWritableStream<GetFuncLogsRequest, FuncLog>): Promise<void>;
    /**
     * @deprecated
     *
     * This function creates a single use, scoped token, useful for pushing images
     * to a private Docker registry.
     */
    createRegistryToken(call: grpc.ServerUnaryCall<CreateRegistryTokenRequest>, callback: grpc.sendUnaryData<CreateRegistryTokenResponse>): Promise<void>;
}
