'use strict';

require('@google-cloud/trace-agent').start();
require('@google-cloud/debug-agent').start({
	allowExpressions: true
});
const express = require('express');
const relay = require('./catrelay');

const app = express();
app.set('view engine', 'pug');
app.use(express.static('public'));
app.get('/', (request, response) => {
	response.render('index');
});

const http = require('http').createServer(app);
const port = process.env.PORT || 8080;

const io = require('socket.io')(http, {
	transports: ['polling']
});

http.listen(port, () => {
	console.log(`cloudcats web listening on ${port}`);
});

relay.listen(io);
