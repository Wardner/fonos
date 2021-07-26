"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const agents_pb_1 = require("./protos/agents_pb");
function default_1(jsonObj) {
    const agent = new agents_pb_1.Agent();
    const spec = jsonObj.spec;
    agent.setRef(jsonObj.metadata.ref);
    agent.setName(jsonObj.metadata.name);
    agent.setUsername(spec.credentials.username);
    agent.setSecret(spec.credentials.secret);
    agent.setDomainsList(spec.domains);
    agent.setCreateTime(jsonObj.metadata.createdOn);
    agent.setUpdateTime(jsonObj.metadata.modifiedOn);
    return agent;
}
exports.default = default_1;
