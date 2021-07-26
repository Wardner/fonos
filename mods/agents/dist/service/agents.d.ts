import grpc from "grpc";
import { Agent, ListAgentsRequest, ListAgentsResponse, GetAgentRequest, CreateAgentRequest, UpdateAgentRequest, DeleteAgentRequest } from "./protos/agents_pb";
import { Empty } from "./protos/common_pb";
import { IAgentsServer, IAgentsService, AgentsService } from "./protos/agents_grpc_pb";
import { ResourceServer } from "@fonos/core";
declare class AgentsServer extends ResourceServer implements IAgentsServer {
    listAgents(call: grpc.ServerUnaryCall<ListAgentsRequest>, callback: grpc.sendUnaryData<ListAgentsResponse>): Promise<void>;
    createAgent(call: grpc.ServerUnaryCall<CreateAgentRequest>, callback: grpc.sendUnaryData<Agent>): Promise<void>;
    updateAgent(call: grpc.ServerUnaryCall<UpdateAgentRequest>, callback: grpc.sendUnaryData<Agent>): Promise<void>;
    getAgent(call: grpc.ServerUnaryCall<GetAgentRequest>, callback: grpc.sendUnaryData<Agent>): Promise<void>;
    deleteAgent(call: grpc.ServerUnaryCall<DeleteAgentRequest>, callback: grpc.sendUnaryData<Empty>): Promise<void>;
}
export { AgentsServer as default, IAgentsService, AgentsService };
