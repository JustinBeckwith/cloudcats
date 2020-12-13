'use strict';

require('@google-cloud/trace-agent').start();
require('@google-cloud/debug-agent').start({
	allowExpressions: true
});

const loader = require('@grpc/proto-loader');
const grpc = require('@grpc/grpc-js');
const analyzer = require('./analyzer');
const logger = require('./logger');

const packageDef = loader.loadSync('cloudcats.proto');
const proto = grpc.loadPackageDefinition(packageDef).cloudcats;

const server = new grpc.Server();
server.addService(proto.Worker.service, {
	analyze: async call => {
		try {
			await analyzer.analyze(call);
			logger.info('Request complete. Ending streaming response.');
			call.end();
		} catch (error) {
			console.error(error);
			logger.error('Error analyzing reddit');
			logger.error(error);
			call.end();
		}
	}
});
const port = process.env.PORT || 8081;
server.bindAsync(`0.0.0.0:${port}`, grpc.ServerCredentials.createInsecure(), (err, port) => {
	server.start();
	console.log(`worker service started on ${port}`);
});
