export interface GoogleSpeechConfig {
    languageCode: string;
}
export interface TrackerConfig {
    config: {
        encoding: "LINEAR16";
        sampleRateHertz: 16000;
        languageCode: string;
    };
    interimResults: boolean;
}
