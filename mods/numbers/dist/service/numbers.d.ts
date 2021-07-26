import grpc from "grpc";
import { ListNumbersRequest, ListNumbersResponse, GetNumberRequest, CreateNumberRequest, UpdateNumberRequest, DeleteNumberRequest, GetIngressInfoRequest } from "./protos/numbers_pb";
import NumberPB from "./protos/numbers_pb";
import { Empty } from "./protos/common_pb";
import { INumbersService, NumbersService, INumbersServer } from "./protos/numbers_grpc_pb";
import { ResourceServer } from "@fonos/core";
declare class NumbersServer extends ResourceServer implements INumbersServer {
    listNumbers(call: grpc.ServerUnaryCall<ListNumbersRequest>, callback: grpc.sendUnaryData<ListNumbersResponse>): Promise<void>;
    createNumber(call: grpc.ServerUnaryCall<CreateNumberRequest>, callback: grpc.sendUnaryData<NumberPB.Number>): Promise<void>;
    updateNumber(call: grpc.ServerUnaryCall<UpdateNumberRequest>, callback: grpc.sendUnaryData<NumberPB.Number>): Promise<void>;
    getIngressInfo(call: grpc.ServerUnaryCall<GetIngressInfoRequest>, callback: grpc.sendUnaryData<NumberPB.IngressInfo>): Promise<void>;
    getNumber(call: grpc.ServerUnaryCall<GetNumberRequest>, callback: grpc.sendUnaryData<NumberPB.Number>): Promise<void>;
    deleteNumber(call: grpc.ServerUnaryCall<DeleteNumberRequest>, callback: grpc.sendUnaryData<Empty>): Promise<void>;
}
export { NumbersServer as default, INumbersService, NumbersService };
