
# Introduction
HTTP/WebSocket Client (JavaScript) for Enapso Enterprise Server.
  
# Installation
  ```bash
  npm install --save enapso-client-js
  ```

# Getting Started
For this example we will use a production installation of the [Enapso Enterprise Server](https://www.innotrade.com/products/enapso-enterprise-server), this is the [Enapso Dash](https://dash.innotrade.com) platform.
The library use [ES6 Promise](https://developers.google.com/web/fundamentals/getting-started/primers/promises) based APIs.

1. Creating connection instance:
  ```js
<<<<<<< HEAD
  // HTTP connection
=======
>>>>>>> 0dab601f3320728de5ca523c8abc61ad0e2a9cc8
  const HttpClient = require('enapso-client-js').HttpClient;
  const conn = new HttpClient({
    url: 'https://dash.innotrade.com/http',
    username: 'guest',
    password: 'guest'
  });
  ```
<<<<<<< HEAD
  ```js
  // WebSocket connection
  const WebSocketClient = require("./index.js").WebSocketClient
  const conn = new WsClient({
    url: 'wss://heprdlxdemo01.innotrade.com', // your remote Enapso server instance
    username: 'guest',
    password: 'guest'
  });
  ```
=======
>>>>>>> 0dab601f3320728de5ca523c8abc61ad0e2a9cc8

2. Opening connection and login:
  ```js
  conn.open().then(() => {
    return conn.login();
  }).then(() => {
    // here authenticated ...
  }).catch(console.error);
  ```

2. Making requests to the server:
  ```js
  conn.send({
    ns: 'com.enapso.plugins.ontology',
    type: 'runSPARQLQuery',
    ontologyAlias: 'EnapsoUnits',
    query: 'SELECT ?v WHERE {?s ?p ?v} LIMIT 5',
    reasoning: false
  }).then(console.log).catch(console.error);
  ```

3. Logout and close connection
  ```js
  conn.logout().then(() => {
    return conn.close();
  }).then(() => {
    // here closed ...
  }).catch(console.error);
  ```

4. Join all together using a more elegant way, the [co library](https://www.npmjs.com/package/co):
  ```js
  const co = require('co');
  const HttpClient = require('enapso-client-js').HttpClient;
  const conn = new HttpClient({
    url: 'https://dash.innotrade.com/http',
    username: 'guest',
    password: 'guest'
  });

  co(function *(){
    // opening connection
    yield conn.open();
    // login
    yield conn.login();
    // making request
    let response = yield conn.send({
      ns: 'com.enapso.plugins.ontology',
      type: 'runSPARQLQuery',
      ontologyAlias: 'EnapsoUnits',
      query: 'SELECT ?v WHERE {?s ?p ?v} LIMIT 5',
      reasoning: false
    });
    console.log(response);
    // logout
    yield conn.logout();
    // close connection
    yield conn.close();
  }).catch(console.error);
  ```

# Config params
```js
let config = {};
<<<<<<< HEAD
config.url = 'https://localhost:8787/Enapso/Enapso'; // the Enapso Enterprise Server connection URL
config.username = 'root'; // login username
config.password = 'root'; // login password
=======
config.url = 'https://dash.innotrade.com/http'; // the Enapso Enterprise Server connection URL
config.username = 'guest'; // login username
config.password = 'guest'; // login password
>>>>>>> 0dab601f3320728de5ca523c8abc61ad0e2a9cc8
config.autoSyncTimeout = 500; // timeout used by the HttpClient to automatically pull messages from the server. Min value: 400ms
```

# API
**getId**: Get the connection id value. CAUTION: this value should be kept secret.

```js
conn.getId(); // UUID v4 value
```

**getConfig**: Get the configuration object passed to the client during initialization.

```js
conn.getConfig();
```

**open**: Open the client connection.

```js
conn.open().then(() => { console.log('connected!'); });
```

**login**: Login the client connection. Optionally username, password arguments can be passed to override the ones in the configuration. The response argument contains the user authorities/rights.

```js
conn.login().then((response) => { console.log('authenticated!'); });
```

**send**: Send a request message to the server.

```js
conn.send({{
  ns: 'com.enapso.plugins.ontology',
  type: 'runSPARQLQuery',
  ontologyAlias: 'EnapsoUnits',
  query: 'SELECT ?v WHERE {?s ?p ?v} LIMIT 5',
  reasoning: false
}}).then((response) => {});
```

**sync**: (Only available on HttpClient) Pull pending messages from the server and trigger the 'message' event if applicable. CAUTION: This feature is internally executed by the HTTP client on periodic intervals. See 'autoSyncTimeout' configuration property. 

```js
conn.sync().then((messages) => {});
```

**getStatus**: Get the client status: UP, DOWN 

```js
conn.getStatus();
```

**logout**: Logout the client connection. 

```js
conn.logout().then(() => { console.log('logged out!'); });
```

**close**: Close the client connection. 

```js
conn.close().then(() => { console.log('closed!'); });
```

# Triggered events
```js
conn.on('message', (msg) => {
  // triggered when a new message arrives from the server
  // argument msg is a JSON object
});
```

<<<<<<< HEAD
=======
# Roadmap
1. Introduce WebSocket support.

>>>>>>> 0dab601f3320728de5ca523c8abc61ad0e2a9cc8
# Tests
```bash
$ git clone https://github.com/innotrade/enapso-client-js.git
$ cd enapso-client-js/
$ npm install
$ npm test
<<<<<<< HEAD
```
=======
```
>>>>>>> 0dab601f3320728de5ca523c8abc61ad0e2a9cc8
