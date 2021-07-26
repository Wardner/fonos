export interface GoogleTTSConfig {
    keyFilename: string;
    projectId?: string;
    path?: string;
}
export interface SynthOptions {
    name?: string;
    ssmlGender?: "MALE" | "FEMALE";
    naturalSampleRateHertz?: number;
    languageCodes?: string[];
}
