const logger = require('./logger');

module.exports = {
	dig: err => {
		if (err.name === 'PartialFailureError') {
			for (const err1 of err.errors) {
				logger.error('Failed to analyze image');
				for (const err2 of err1.errors) {
					logger.error(err2);
				}
			}
		}
	}
};
