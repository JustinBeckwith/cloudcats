'use strict';

require('@google-cloud/trace-agent').start();
require('@google-cloud/debug-agent').start({
	allowExpressions: true
});

const path = require('path');
const Hapi = require('hapi');

process.on('unhandledRejection', (reason, p) => {
	console.log('Unhandled Rejection at: Promise', p, 'reason:', reason);
});

// Set up the server
const server = new Hapi.Server({
	host: '0.0.0.0',
	port: process.env.PORT || 8080
});

// Set up socket.io
const io = require('socket.io')(server.listener, {
	transports: ['polling']
});

const relay = require('./catrelay');
const logger = require('./logger');

async function main() {
	await server.register([require('vision'), require('@hapi/inert')]);

	// Configure jade views
	server.views({
		engines: {pug: require('pug')},
		path: path.join(__dirname, '/templates'),
		compileOptions: {
			pretty: true
		}
	});

	// Set up static public handler
	server.route({
		method: 'GET',
		path: '/{param*}',
		handler: {
			directory: {
				path: 'public'
			}
		}
	});

	server.route({
		method: 'GET',
		path: '/',
		handler: (request, h) => {
			return h.view('index');
		}
	});

	// Start the server
	await server.start();
	logger.info(`Server running at ${server.info.uri}`);

	// Start listening for cats
	relay.listen(io);
}

main();
