import grpc from "grpc";
import { Domain, ListDomainsRequest, ListDomainsResponse, GetDomainRequest, CreateDomainRequest, UpdateDomainRequest, DeleteDomainRequest } from "./protos/domains_pb";
import { Empty } from "./protos/common_pb";
import { IDomainsService, DomainsService, IDomainsServer } from "./protos/domains_grpc_pb";
import { ResourceServer } from "@fonos/core";
declare class DomainsServer extends ResourceServer implements IDomainsServer {
    listDomains(call: grpc.ServerUnaryCall<ListDomainsRequest>, callback: grpc.sendUnaryData<ListDomainsResponse>): Promise<void>;
    createDomain(call: grpc.ServerUnaryCall<CreateDomainRequest>, callback: grpc.sendUnaryData<Domain>): Promise<void>;
    updateDomain(call: grpc.ServerUnaryCall<UpdateDomainRequest>, callback: grpc.sendUnaryData<Domain>): Promise<void>;
    getDomain(call: grpc.ServerUnaryCall<GetDomainRequest>, callback: grpc.sendUnaryData<Domain>): Promise<void>;
    deleteDomain(call: grpc.ServerUnaryCall<DeleteDomainRequest>, callback: grpc.sendUnaryData<Empty>): Promise<void>;
}
export { DomainsServer as default, IDomainsService, DomainsService };
