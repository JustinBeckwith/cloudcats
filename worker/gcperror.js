const logger = require('./logger');

module.exports = {
	dig: error => {
		if (error.name === 'PartialFailureError') {
			for (const error1 of error.errors) {
				logger.error('Failed to analyze image');
				for (const error2 of error1.errors) {
					logger.error(error2);
				}
			}
		}
	}
};
