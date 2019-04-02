'use strict';

const axios = require('axios');
const uuid = require('uuid/v4');
const Vision = require('@google-cloud/vision');
const Storage = require('@google-cloud/storage');

const gconf = {
	keyFilename: 'keyfile.json'
};

const bucketName = 'cloudcats-bucket';
const vision = new Vision.ImageAnnotatorClient(gconf);
const storage = new Storage(gconf);
const bucket = storage.bucket(bucketName);

async function annotate(url) {
	const name = uuid();
	const file = bucket.file(name);

	const res = await axios({
		url,
		responseType: 'stream'
	});
	if (!res.data) {
		throw new Error('Response failed to return data.');
	}

	await new Promise(resolve => {
		res.data
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
