const winston = require('winston');
const {LoggingWinston} = require('@google-cloud/logging-winston');

const logger = winston.createLogger({
	transports: [
		new winston.transports.Console({
			handleExceptions: true
		}),
		new LoggingWinston({
			logName: 'cloudcats-web'
		})
	]
});

module.exports = logger;
