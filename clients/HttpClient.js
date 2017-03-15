/*
 Copyright (C) 2016 Innotrade GmbH <https://innotrade.com>

 Licensed under the Apache License, Version 2.0 (the "License");
 you may not use this file except in compliance with the License.
 You may obtain a copy of the License at
 
    http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 See the License for the specific language governing permissions and
 limitations under the License.
 */

const UUID = require('uuid');
const EventEmitter = require('eventemitter2').EventEmitter2;
const r = require('request');

class HttpClient extends EventEmitter {
    constructor(config) {
        super({
            wildcard: true,
            newListener: true
        });

        this.config = config;
        this.id = UUID.v4();
        this.utid = 0;
        this.config.autoSyncTimeout = Math.max(400, config.autoSyncTimeout || 0);
        this.status = 'DOWN';
    }

    getStatus() {
        return this.status;
    }

    getConfig() {
        return this.config;
    }

    getId() {
        return this.id;
    }

    open() {
        let self = this;
        return new Promise((resolve, reject) => {
            r(self.config.url + `?connectionId=${self.getId()}&action=open`, (err, res, body) => {
                if (!err && res.statusCode == 200) {
                    self.status = 'UP';
                    self.syncTaskId = setInterval(() => {
                        self.sync();
                    }, self.config.autoSyncTimeout);

                    resolve();
                } else {
                    reject({
                        err: err,
                        response: res
                    });
                }
            })
        });
    }

    close() {
        let self = this;
        return new Promise((resolve, reject) => {
            r(self.config.url + `?connectionId=${self.getId()}&action=close`, (err, res, body) => {
                if (!err && res.statusCode == 200) {
                    self.status = 'DOWN';
                    clearInterval(self.syncTaskId);

                    resolve();
                } else {
                    reject({
                        err: err,
                        response: res
                    });
                }
            })
        });
    }

    login(username, password) {
        username = encodeURIComponent(username || this.config.username);
        password = encodeURIComponent(password || this.config.password);
        let self = this;

        return new Promise((resolve, reject) => {
            r(self.config.url + `?connectionId=${self.getId()}&action=login&username=${username}&password=${password}`, (err, res, body) => {
                if (!err && res.statusCode == 200) {
                    resolve(JSON.parse(body));
                } else {
                    reject({
                        err: err,
                        response: res
                    });
                }
            })
        });
    }

    logout() {
        let self = this;
        return new Promise((resolve, reject) => {
            r(self.config.url + `?connectionId=${self.getId()}&action=logout`, (err, res, body) => {
                if (!err && res.statusCode == 200) {
                    resolve();
                } else {
                    reject({
                        err: err,
                        response: res
                    });
                }
            })
        });
    }

    sync() {
        let self = this;
        return new Promise((resolve, reject) => {
            r(self.config.url + `?connectionId=${self.getId()}&action=sync`, (err, res, body) => {
                if (!err && res.statusCode == 200) {
                    let messages = JSON.parse(body);
                    for (let i = 0; i < messages.length; i++) {
                        let msg = JSON.parse(messages[i]);
                        messages[i] = msg;
                        setTimeout(() => {
                            self.emit('message', msg);
                            if (msg.type == 'response') {
                                self.emit('response.' + msg.utid, msg);
                            }
                        }, 0);
                    }
                    resolve(messages);
                } else {
                    reject({
                        err: err,
                        response: res
                    });
                }
            })
        });
    }

    send(token, addResponseCallback = true) {
        let self = this;
        token.utid = this.utid++;

        return new Promise((resolve, reject) => {
            r({
                url: self.config.url + `?connectionId=${self.getId()}&action=send`,
                method: 'POST',
                json: token
            }, (err, res, body) => {
                if (!err && res.statusCode == 200) {
                    if (body) {
                        resolve(body);
                    } else if (addResponseCallback) {
                        self.once('response.' + token.utid, resolve);
                    } else {
                        resolve();
                    }
                } else {
                    reject({
                        err: err,
                        response: res
                    });
                }
            });
        });
    }
}

module.exports = HttpClient;