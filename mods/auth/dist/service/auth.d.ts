import grpc from "grpc";
import { GetRoleRequest, Role, ValidateTokenRequest, ValidateTokenResponse, CreateTokenRequest, CreateTokenResponse } from "./protos/auth_pb";
import { IAuthServer, IAuthService, AuthService } from "./protos/auth_grpc_pb";
declare class AuthServer implements IAuthServer {
    validateToken(call: grpc.ServerUnaryCall<ValidateTokenRequest>, callback: grpc.sendUnaryData<ValidateTokenResponse>): Promise<void>;
    createToken(call: grpc.ServerUnaryCall<CreateTokenRequest>, callback: grpc.sendUnaryData<CreateTokenResponse>): Promise<void>;
    createNoAccessToken(call: grpc.ServerUnaryCall<CreateTokenRequest>, callback: grpc.sendUnaryData<CreateTokenResponse>): Promise<void>;
    getRole(call: grpc.ServerUnaryCall<GetRoleRequest>, callback: grpc.sendUnaryData<Role>): Promise<void>;
}
export { AuthServer as default, IAuthService, AuthService };
