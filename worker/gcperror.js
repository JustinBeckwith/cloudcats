const logger = require('./logger');

module.exports = {
	dig: err => {
		if (err.name === 'PartialFailureError') {
			for (const e of err.errors) {
				logger.error('Failed to analyze image');
				for (const e2 of e.errors) {
					logger.error(e2);
				}
			}
		}
	}
};
