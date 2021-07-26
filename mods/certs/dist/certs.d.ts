declare const PATH_TO_SALT: string;
declare const PATH_TO_CONFIG: string;
declare const ACCESS_KEY_ID: string;
declare const AUTH_ISS: string;
declare const getSalt: () => string;
declare const configExist: () => boolean;
declare const saltExist: () => boolean;
declare function createAccessFile(): Promise<{
    accessKeyId: string;
    accessKeySecret: string;
}>;
declare function createServerConfig(workdir: string): void;
declare function createClientConfig(workdir: string): void;
export { createAccessFile as default, createServerConfig, createClientConfig, getSalt, configExist, saltExist, PATH_TO_SALT, PATH_TO_CONFIG, ACCESS_KEY_ID, AUTH_ISS };
