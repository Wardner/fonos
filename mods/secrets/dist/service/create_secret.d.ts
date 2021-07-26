import { CreateSecretResponse } from "./protos/secrets_pb";
export default function (name: string, secret: string, accessKeyId: string): Promise<CreateSecretResponse>;
