'use strict';

require('@google-cloud/trace-agent').start();
require('@google-cloud/debug-agent').start({
	allowExpressions: true
});

const loader = require('@grpc/proto-loader');
const grpc = require('grpc');
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
			logger.error('Error analyzing reddit');
			logger.error(error);
			call.end();
		}
	}
});
const port = process.env.PORT || 8081;
server.bind(`0.0.0.0:${port}`, grpc.ServerCredentials.createInsecure());
server.start();
