"use strict";
/*
 * Copyright (C) 2021 by Fonoster Inc (https://fonoster.com)
 * http://github.com/fonoster/fonos
 *
 * This file is part of Project Fonos
 *
 * Licensed under the MIT License (the "License");
 * you may not use this file except in compliance with
 * the License. You may obtain a copy of the License at
 *
 *    https://opensource.org/licenses/MIT
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.objectToQString = void 0;
/**
 * Takes a json object and creates a query formatted string
 *
 * @param {object} - a one level json object with the query options
 * @returns {string} a string in the form of 'key1=value1&key2=value2&...'
 */
const objectToQString = (obj = {}) => Object.keys(obj)
    .filter((key) => obj[key])
    .map((key) => {
    const encodedObj = obj[key] === "#" ? encodeURIComponent("#") : obj[key];
    return `${key}=${encodedObj}`;
})
    .join("&");
exports.objectToQString = objectToQString;
