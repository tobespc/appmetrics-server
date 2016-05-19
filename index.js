/*******************************************************************************
 * Copyright 2014, 2015 IBM Corp.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *******************************************************************************/
 

// This application uses express as its web server
// for more info, see: http://expressjs.com
var express = require('express');

// cfenv provides access to your Cloud Foundry environment
// for more info, see: https://www.npmjs.com/package/cfenv
var cfenv = require('cfenv');

// create a new express server
var app = express();

// serve the files out of ./public as our main files
app.use(express.static(__dirname + '/public'));

// get the app environment from Cloud Foundry
var appEnv = cfenv.getAppEnv();

var http = require('http').Server(app);
var io = require('socket.io')(http);
var appmetrics = require('appmetrics');
var monitoring = appmetrics.monitor();

http.listen(appEnv.port, function() {
    console.log("Tobes server starting on "+ appEnv.url);
});

/*
 * Broadcast monitoring data to connected clients when it arrives
 */
monitoring.on('cpu', function (data) {
  console.log('Tobes emitting cpu');
  io.emit('cpu', JSON.stringify(data));
});

monitoring.on('memory', function (data) {
  io.emit('memory', JSON.stringify(data));
});

monitoring.on('gc', function (data) {
  io.emit('gc', JSON.stringify(data));
});

monitoring.on('profiling', function (data) {
  io.emit('profiling', JSON.stringify(data));
});


