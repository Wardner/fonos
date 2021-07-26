import winston from "winston";
declare const logger: winston.Logger;
declare const mute: () => void;
declare const unmute: () => void;
export { logger as default, mute, unmute };
