import { SecretName } from "./protos/secrets_pb";
export default function (pageToken: number, pageSize: number, accessKeyId: string): Promise<{
    secrets?: undefined;
    pageToken?: undefined;
} | {
    secrets: SecretName[];
    pageToken: number;
}>;
