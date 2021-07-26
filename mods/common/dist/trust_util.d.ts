import grpc from "grpc";
declare const getServerCredentials: () => grpc.ServerCredentials;
declare const getClientCredentials: (grpc: any) => any;
export { getClientCredentials, getServerCredentials };
