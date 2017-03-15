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
const WebSocket = require('ws');

class WebSocketClient extends EventEmitter {
    constructor(config) {
        super({
            wildcard: true,
            newListener: true
        });

        this.config = config;
        this.id = UUID.v4();
        this.utid = 0;

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
            self.once('welcome', (msg) => {
                resolve(msg);
            });
            self.client = new WebSocket(self.config.url);
            self.client.on('error', (e) => {
                self.emit('error', e);
            });

            self.client.on('open', () => {
                self.emit('connected');
            });

            self.client.on('close', (e) => {
                self.status = 'DOWN';
                self.emit('close', e);
            });

            self.client.on('message', (data) => {
                setTimeout(() => {
                    try {
                        let msg = JSON.parse(data);
                        self.emit('message', msg);

                        if (msg.type == 'response') {
                            self.emit('response.' + msg.utid, msg);
                        } else if (msg.type == 'welcome' && msg.ns == 'com.enapso.plugins.system') {
                            self.status = 'UP';
                            self.emit('welcome', msg);
                        }
                    } catch (err) {
                        // discard non JSON messages
                    }
                }, 0);
            });
        });
    }

    close() {
        let self = this;
        return new Promise((resolve, reject) => {
            try {
                self.client.close();
                resolve();
            } catch (err) {
                reject(err);
            }
        });
    }

    login(username, password) {
        username = username || this.config.username;
        password = password || this.config.password;
        let self = this;

        return self.send({
            ns: 'com.enapso.plugins.system',
            type: "login",
            username,
            password
        });
    }

    logout() {
        let self = this;

        return self.send({
            ns: 'com.enapso.plugins.system',
            type: "logout"
        });
    }

    send(token, addResponseCallback = true) {
        console.log(token);
        let self = this;
        token.utid = this.utid++;

        return new Promise((resolve, reject) => {
            try {
                if (addResponseCallback) {
                    self.once('response.' + token.utid, resolve);
                }
                self.client.send(JSON.stringify(token));
            } catch (err) {
                reject(err);
            }
        });
    }
}

module.exports = WebSocketClient;