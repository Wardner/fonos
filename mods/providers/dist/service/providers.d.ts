import grpc from "grpc";
import { Provider, ListProvidersRequest, ListProvidersResponse, GetProviderRequest, CreateProviderRequest, UpdateProviderRequest, DeleteProviderRequest } from "./protos/providers_pb";
import { Empty } from "./protos/common_pb";
import { IProvidersService, ProvidersService, IProvidersServer } from "./protos/providers_grpc_pb";
import { ResourceServer } from "@fonos/core";
declare class ProvidersServer extends ResourceServer implements IProvidersServer {
    listProviders(call: grpc.ServerUnaryCall<ListProvidersRequest>, callback: grpc.sendUnaryData<ListProvidersResponse>): Promise<void>;
    createProvider(call: grpc.ServerUnaryCall<CreateProviderRequest>, callback: grpc.sendUnaryData<Provider>): Promise<void>;
    updateProvider(call: grpc.ServerUnaryCall<UpdateProviderRequest>, callback: grpc.sendUnaryData<Provider>): Promise<void>;
    getProvider(call: grpc.ServerUnaryCall<GetProviderRequest>, callback: grpc.sendUnaryData<Provider>): Promise<void>;
    deleteProvider(call: grpc.ServerUnaryCall<DeleteProviderRequest>, callback: grpc.sendUnaryData<Empty>): Promise<void>;
}
export { ProvidersServer as default, IProvidersService, ProvidersService };
