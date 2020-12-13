'use strict';

const {request} = require('gaxios');
const uuid = require('uuid');
const {ImageAnnotatorClient} = require('@google-cloud/vision');
const {Storage} = require('@google-cloud/storage');

const bucketName = 'cloudcats-bucket';
const vision = new ImageAnnotatorClient();
const storage = new Storage();
const bucket = storage.bucket(bucketName);

async function annotate(url) {
	const name = uuid.v4();
	const file = bucket.file(name);

	const response = await request({
		url,
		responseType: 'stream'
	});
	if (!response.data) {
		throw new Error('Response failed to return data.');
	}

	await new Promise(resolve => {
		response.data
			.pipe(file.createWriteStream())
			.on('finish', () => {
				resolve();
			});
	});

	const labels = await vision.labelDetection(`gs://${bucketName}/${name}`);
	file.delete();
	return {
		url,
		labels: labels[0].labelAnnotations.map(x => x.description)
	};
}

const api = {
	annotate
};

module.exports = api;
