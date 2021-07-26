import { GetSecretResponse } from "./protos/secrets_pb";
export default function (name: string, accessKeyId: string): Promise<GetSecretResponse>;
