#!/usr/bin/env node
import CallManagerServer from "./callmanager";
import {CallManagerService} from "./protos/callmanager_grpc_pb";
import {AuthMiddleware} from "@fonos/auth";
import {getSalt} from "@fonos/certs";
import {runServices} from "@fonos/common";

const services = [
  {
    name: "callmanager",
    version: "v1beta1",
    service: CallManagerService,
    server: new CallManagerServer()
  }
];

const middleware = {
  name: "authentication",
  middlewareObj: new AuthMiddleware(getSalt()).middleware
};

runServices(services, [middleware]);
