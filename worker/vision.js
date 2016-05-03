'use strict';

const request = require('request');
const uuid = require('node-uuid');
const util = require('util');
const gcloud = require('gcloud')({
  projectId: process.env.GCLOUD_PROJECT,
  keyFilename: 'keyfile.json'
});

const vision = gcloud.vision();
const storage = gcloud.storage();
const bucket = storage.bucket(process.env.GCLOUD_BUCKET);

var count = 0;

function annotate(url, callback) {

  let name = uuid.v4();
  let file = bucket.file(name);
  var idx = count++;
  request(url)
    .pipe(file.createWriteStream())
    .on('finish', () => {
      vision.detectLabels(file, (err, labels) => {
        if (err) {
          console.error("Error detecting labels: " + util.inspect(err));
          return callback(err);
        }
        file.delete();
        callback(null, {
          url: url,
          labels: labels
        });
      });
    }).on('error', (err) => {
      console.error("Error requesting content: \n\t" + url + "\n\t" + util.inspect(err) + "\n\t" + err.stack);
      return callback(err);
    });
}

let api = {
  annotate: annotate
}

module.exports = api;