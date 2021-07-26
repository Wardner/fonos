import grpc from "grpc";
import { Kind } from "../common/resource_builder";
import { ListResourceResponse } from "./types";
export default class ResourceServer {
    listResources(kind: Kind, call: grpc.ServerUnaryCall<any>): Promise<ListResourceResponse>;
    getResource(kind: Kind, call: grpc.ServerUnaryCall<any>): Promise<unknown>;
    deleteResource(kind: Kind, call: grpc.ServerUnaryCall<any>): Promise<void>;
}
