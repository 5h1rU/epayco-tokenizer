'use strict';

var uuid = require('uuid');
var CryptoJS = require('crypto-js');
require('whatwg-fetch');

/*! *****************************************************************************
Copyright (c) Microsoft Corporation. All rights reserved.
Licensed under the Apache License, Version 2.0 (the "License"); you may not use
this file except in compliance with the License. You may obtain a copy of the
License at http://www.apache.org/licenses/LICENSE-2.0

THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
MERCHANTABLITY OR NON-INFRINGEMENT.

See the Apache Version 2.0 License for specific language governing permissions
and limitations under the License.
***************************************************************************** */

function __awaiter(thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
}

function __generator(thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
}

var Tokenizer = /** @class */ (function () {
    function Tokenizer(API_KEY) {
        this.API_KEY = API_KEY;
        this.getPublicKey() || this.setPublicKey(API_KEY);
        this.getGuid() || this.setGuid();
    }
    Tokenizer.prototype.setPublicKey = function (key) {
        return localStorage.setItem('epayco_publish_key', key);
    };
    Tokenizer.prototype.getPublicKey = function () {
        return localStorage.getItem('epayco_publish_key');
    };
    Tokenizer.prototype.init = function (payload) {
        return __awaiter(this, void 0, void 0, function () {
            var guid, tokenFromServer, response, token;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        guid = this.getGuid();
                        return [4 /*yield*/, this.getTokenFromServer(guid)];
                    case 1:
                        tokenFromServer = _a.sent();
                        return [4 /*yield*/, this.serialize(payload, tokenFromServer, guid)];
                    case 2:
                        response = _a.sent();
                        return [4 /*yield*/, this.tokenize(response)];
                    case 3:
                        token = _a.sent();
                        return [2 /*return*/, token];
                }
            });
        });
    };
    Tokenizer.prototype.setGuid = function () {
        return localStorage.setItem('keyUserIndex', uuid.v4());
    };
    Tokenizer.prototype.getGuid = function () {
        return localStorage.getItem('keyUserIndex');
    };
    Tokenizer.prototype.encrypt = function (value, token) {
        return CryptoJS.AES.encrypt(value, token).toString();
    };
    Tokenizer.prototype.getTokenFromServer = function (uuid$$1) {
        return __awaiter(this, void 0, void 0, function () {
            var response, res, token, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, fetch('https://api.secure.payco.co/token/encrypt', {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json; charset=utf-8'
                                },
                                body: JSON.stringify({
                                    public_key: this.getPublicKey(),
                                    session: uuid$$1
                                })
                            })];
                    case 1:
                        response = _a.sent();
                        return [4 /*yield*/, response.json()];
                    case 2:
                        res = _a.sent();
                        if (!res.status) {
                            throw new Error(res.message);
                        }
                        token = res.data.token;
                        return [2 /*return*/, token];
                    case 3:
                        error_1 = _a.sent();
                        console.log('entra al catch?', error_1);
                        throw error_1;
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    Tokenizer.prototype.serialize = function (payload, token, guid) {
        var _this = this;
        var payloadSerialized = payload.map(function (x) {
            return {
                type: x.type,
                value: _this.encrypt(x.value, token)
            };
        });
        payloadSerialized.push({
            type: 'publicKey',
            value: this.getPublicKey()
        });
        payloadSerialized.push({
            type: 'session',
            value: guid
        });
        return JSON.stringify(payloadSerialized);
    };
    Tokenizer.prototype.tokenize = function (values) {
        return __awaiter(this, void 0, void 0, function () {
            var response, res, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, fetch('https://api.secure.payco.co/token/tokenize', {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json; charset=utf-8'
                                },
                                body: JSON.stringify({ values: values })
                            })];
                    case 1:
                        response = _a.sent();
                        return [4 /*yield*/, response.json()];
                    case 2:
                        res = _a.sent();
                        return [2 /*return*/, res];
                    case 3:
                        error_2 = _a.sent();
                        throw error_2;
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    return Tokenizer;
}());

module.exports = Tokenizer;
