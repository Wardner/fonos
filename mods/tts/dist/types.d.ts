export interface TTSPlugin {
    synthetize(text: string, options: any): Promise<SynthResult>;
}
export interface SynthResult {
    filename: string;
    pathToFile: string;
}
