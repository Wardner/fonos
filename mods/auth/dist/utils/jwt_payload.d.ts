export default class JwtPayload {
    iss: string;
    role: string;
    accessKeyId: string;
    constructor(issuer: string, role: string, accessKeyId: string);
}
