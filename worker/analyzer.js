'use strict';

const {inspect, callbackify} = require('util');
const async = require('async');
const {BigQuery} = require('@google-cloud/bigquery');
const reddit = require('./reddit');
const vision = require('./vision');
const logger = require('./logger');

const bigquery = new BigQuery();
const dataset = bigquery.dataset('cloudcats');
const table = dataset.table('images');

const PostType = {
	CAT: 0,
	DOG: 1,
	NEITHER: 2,
	BOTH: 3
};

async function publishToBigQuery(data) {
	try {
		await table.insert(data);
	} catch (error) {
		logger.error(`error publishing to bigquery: ${inspect(error)}\n\t${error.stack}`);
	}
}

async function publishEvent(result, call) {
	let type = PostType.NEITHER;
	console.log(result.labels);
	const containsDog = result.labels.map(x => x.toLowerCase()).includes('dog');
	const containsCat = result.labels.map(x => x.toLowerCase()).includes('cat');

	if (containsCat && !containsDog) {
		type = PostType.CAT;
	} else if (containsDog && !containsCat) {
		type = PostType.DOG;
	} else if (containsCat && containsDog) {
		type = PostType.BOTH;
	}

	const data = {
		url: result.url,
		type
	};

	// Async publish data to big query
	publishToBigQuery(data);

	// Write out to the gRPC streaming response
	call.write(data);
}

async function analyzeImage(url, call) {
	try {
		logger.info(`processing ${url}`);
		const visionResult = await vision.annotate(url);
		const evt = await publishEvent(visionResult, call);
		return evt;
	} catch (error) {
		logger.error('Error processing image');
		logger.error({
			message: error.message,
			stack: error.stack,
			name: error.name
		});
	}
}

async function analyze(call) {
	logger.info('Starting to analyze!');
	let cnt = 0;
	const ai = callbackify(analyzeImage);
	const urls = await reddit.getImageUrls();
	const q = async.queue((url, callback) => {
		ai(url, call, error => {
			if (!error) {
				cnt++;
				logger.info(`${cnt} objects complete`);
			}

			callback(error);
		});
	}, 15);
	q.push(urls);
	await q.drain();
	logger.info('***all items have been processed***');
}

module.exports = {
	analyze
};
