'use strict';

const grpc = require('@grpc/grpc-js');
const loader = require('@grpc/proto-loader');
const logger = require('./logger');

const packageDef = loader.loadSync('cloudcats.proto');
const proto = grpc.loadPackageDefinition(packageDef).cloudcats;

const apiEndpoint = process.env.WORKER_ENDPOINT || '0.0.0.0:8081';

// Create the subscription, and forward messages to the browser
const listen = io => {
	// Listen to socket.io for a new run request from the browser
	io.on('connection', socket => {
		socket.on('start', () => {
			makeRequest(socket);
		});
	});
};

// Create a new gRPC client.  Connect to the worker, and
// analyze the stream of responses.
function makeRequest(socket) {
	try {
		logger.info(`Requesting a run on ${apiEndpoint}...`);
		let cnt = 0;
		const client = new proto.Worker(apiEndpoint, grpc.credentials.createInsecure());
		const call = client.analyze();
		call.on('data', data => {
			logger.info('received data');
			cnt++;
			logger.info(JSON.stringify(data));
			logger.info(`MESSAGE ${cnt}: ${data.type}`);
			socket.emit('cloudcats', data);
		});
		call.on('end', () => {
			logger.info('Analyze request complete.');
			socket.emit('cloudcats', {
				type: 'FIN'
			});
		});
	} catch (error) {
		logger.error('Error making gRPC request');
		logger.error(error);
	}
}

const api = {
	listen
};

module.exports = api;
