export declare const fsInstance: () => any;
export declare const uploadToFS: (accessKeyId: string, bucket: string, pathToObject: string, object?: string, metadata?: object) => Promise<void>;
export default function (bucket: string): Promise<void>;
