'use strict';

require('@google-cloud/trace-agent').start();
require('@google-cloud/debug-agent').start({
	allowExpressions: true
});
const express = require('express');
const relay = require('./catrelay');

const app = express();
const http = require('http').createServer(app);
const port = process.env.PORT || 8080;

// Set up socket.io
const io = require('socket.io')(http, {
	transports: ['polling']
});

// Configure jade views
app.set('view engine', 'pug');

// Set up static public handler
app.use(express.static('public'));

app.get('/', (request, response) => {
	response.render('index');
});

// Start the server
http.listen(port, () => {
	console.log(`cloudcats web listening on ${port}`);
});

// Start listening for cats
relay.listen(io);
