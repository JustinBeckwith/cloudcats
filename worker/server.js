'use strict';

require('@google/cloud-trace').start();
require('@google/cloud-debug');

const request = require('request');
const Hapi = require('hapi');
const analyzer = require('./analyzer');

const server = new Hapi.Server();
server.connection({ 
  host: '0.0.0.0', 
  port: process.env.PORT || 8081 
});

server.route({
  method: 'GET',
  path:'/go', 
  handler: (request, reply) => {
    analyzer.analyze((err) => {
      return reply('OK!');
    });
  }
});

server.start((err) => {
    if (err) {
        throw err;
    }
    console.log('Server running at:', server.info.uri);
});
