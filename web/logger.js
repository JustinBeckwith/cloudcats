const winston = require('winston');
const {LoggingWinston} = require('@google-cloud/logging-winston');

const logger = new (winston.Logger)({
	transports: [
		new winston.transports.Console({
			handleExceptions: true
		}),
		new LoggingWinston({
			keyFilename: 'keyfile.json',
			logName: 'cloudcats-web'
		})
	]
});

module.exports = logger;
