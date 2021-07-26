#!/usr/bin/env node
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_vault_1 = __importDefault(require("node-vault"));
const vault = node_vault_1.default({
    endpoint: process.env.VAULT_ADDR
});
// init vault server
vault
    .init({ secret_shares: 1, secret_threshold: 1 })
    .then(async (result) => {
    console.log("Initialized vault");
    const keys = result.keys;
    // set token for all following requests
    vault.token = result.root_token;
    console.log("Keep the following information in a safe place");
    console.log("----");
    console.log("keys: " + JSON.stringify(keys));
    console.log("token: " + result.root_token);
    // unseal vault server
    await vault.unseal({ secret_shares: 1, key: keys[0] });
    console.log("Vault unsealed");
    // TODO: Adding initial policy
    // vault policy write fonos-policy vault_policy.hcl
    // TODO: Enable secret engine
    // vault secrets enable -path=secret kv
    // WARNING: Enabling app role is not yet working
    // Enabling approle
    // vault auth enable approle
    console.log("Enabling authentication method approle");
    await vault.enableAuth({
        mount_point: "approle",
        type: "approle",
        description: "Approle auth"
    });
})
    .catch((e) => {
    if (e.message.includes("already initialized")) {
        console.log("Ups! Looks like vault has already been initialized.");
    }
});
