'use strict';

const axios = require('axios');
const logger = require('./logger');

async function getImageUrls() {
	logger.info('Request data from reddit...');
	const allPosts = [];
	const pagesToFetch = 3;
	let after = null;
	for (let i = 0; i < pagesToFetch; i++) {
		logger.info(`Loading page: ${after}`);
		// eslint-disable-next-line no-await-in-loop
		after = await _populatePageUrls(after, allPosts);
		logger.info('Done loading page!');
	}

	logger.info('Reddit data request complete: ' + allPosts.length);
	return allPosts;
}

async function _populatePageUrls(after, allPosts) {
	logger.info('populating page urls...');
	const page = await _getPage(after);
	logger.info(`loaded page ${page.after}!`);
	const posts = page.children.filter(post => {
		return post.data &&
            post.data.preview &&
            post.data.preview.images &&
            post.data.preview.images.length > 0;
	}).map(post =>
		post.data.preview.images[0].source.url.split('&amp;').join('&'));
	// Works around https://goo.gl/u1DWDi --------^^^^^^^^^^^^^^^^^^^^^
	console.log(posts);
	Array.prototype.push.apply(allPosts, posts);
	logger.info(`Pushed ${posts.length} items`);
	return page.after;
}

async function _getPage(after) {
	const options = {
		url: 'https://www.reddit.com/r/aww/hot.json',
		headers: {
			'User-Agent': 'justinbeckwith:cloudcats:v1.0.0 (by /u/justinblat)'
		},
		params: {
			after
		}
	};

	const res = await axios(options);
	return res.data.data;
}

module.exports = {
	getImageUrls
};
