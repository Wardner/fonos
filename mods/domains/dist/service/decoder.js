"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable require-jsdoc */
const domains_pb_1 = require("./protos/domains_pb");
function default_1(jsonObj) {
    const domain = new domains_pb_1.Domain();
    const context = jsonObj.spec.context;
    domain.setRef(jsonObj.metadata.ref);
    domain.setName(jsonObj.metadata.name);
    domain.setDomainUri(context.domainUri);
    domain.setCreateTime(jsonObj.metadata.createdOn);
    domain.setUpdateTime(jsonObj.metadata.modifiedOn);
    if (context.egressPolicy) {
        domain.setEgressRule(context.egressPolicy.rule);
        domain.setEgressNumberRef(context.egressPolicy.numberRef);
    }
    const acl = context.accessControlList;
    if (acl && acl.allow)
        domain.setAccessAllowList(acl.allow);
    if (acl && acl.deny)
        domain.setAccessDenyList(acl.deny);
    return domain;
}
exports.default = default_1;
