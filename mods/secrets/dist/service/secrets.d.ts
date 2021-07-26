import grpc from "grpc";
import { ListSecretIdRequest, ListSecretIdResponse, GetSecretRequest, CreateSecretRequest, DeleteSecretRequest, CreateSecretResponse, GetSecretResponse } from "./protos/secrets_pb";
import { Empty } from "./protos/common_pb";
import { ISecretsService, SecretsService, ISecretsServer } from "./protos/secrets_grpc_pb";
declare class SecretServer implements ISecretsServer {
    listSecretsId(call: grpc.ServerUnaryCall<ListSecretIdRequest>, callback: grpc.sendUnaryData<ListSecretIdResponse>): Promise<void>;
    getSecret(call: grpc.ServerUnaryCall<GetSecretRequest>, callback: grpc.sendUnaryData<GetSecretResponse>): Promise<void>;
    createSecret(call: grpc.ServerUnaryCall<CreateSecretRequest>, callback: grpc.sendUnaryData<CreateSecretResponse>): Promise<void>;
    deleteSecret(call: grpc.ServerUnaryCall<DeleteSecretRequest>, callback: grpc.sendUnaryData<Empty>): Promise<void>;
}
export { SecretServer as default, ISecretsService, SecretsService };
