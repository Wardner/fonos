"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ErrorCodes = exports.FonosSubsysUnavailable = exports.FonosFailedPrecondition = exports.FonosInvalidArgument = exports.FonosAuthError = exports.FonosError = void 0;
const error_1 = __importDefault(require("./error"));
exports.FonosError = error_1.default;
const auth_error_1 = __importDefault(require("./auth_error"));
exports.FonosAuthError = auth_error_1.default;
const invalid_argument_1 = __importDefault(require("./invalid_argument"));
exports.FonosInvalidArgument = invalid_argument_1.default;
const failed_precondition_1 = __importDefault(require("./failed_precondition"));
exports.FonosFailedPrecondition = failed_precondition_1.default;
const subsys_unavailable_1 = __importDefault(require("./subsys_unavailable"));
exports.FonosSubsysUnavailable = subsys_unavailable_1.default;
const ErrorCodes = __importStar(require("./codes"));
exports.ErrorCodes = ErrorCodes;
