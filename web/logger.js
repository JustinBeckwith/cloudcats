const winston = require('winston');
const {LoggingWinston} = require('@google-cloud/logging-winston');

const logger = winston.createLogger({
	transports: [
		new LoggingWinston({
			logName: 'cloudcats-web'
		})
	]
});

if (process.env.NODE_ENV !== 'production') {
	logger.add(new winston.transports.Console({
		format: winston.format.combine(
			winston.format.colorize(),
			winston.format.simple()
		)
	}));
}

module.exports = logger;
