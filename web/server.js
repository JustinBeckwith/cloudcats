'use strict';

require('@google/cloud-trace').start();
require('@google/cloud-debug');

const Hapi = require('hapi');
const path = require('path');
const nconf = require('nconf');
const relay = require('./catrelay')

// Configure nconf for reading environment variables
nconf.argv().env().file({
  file: 'secrets.json'
});

// Set up the server
const server = new Hapi.Server();
server.connection({ 
  host: '0.0.0.0', 
  port: process.env.PORT || 8080 
});

// configure plugins and routes
var plugins = [require('vision'), require('inert')];
server.register(plugins, (err) => {
  if (err) {
      throw err;
  }

  // configure jade views
  server.views({
    engines: { jade: require('jade') },
    path: __dirname + '/templates',
    compileOptions: {
        pretty: true
    }
  });

  // set up static public handler
  server.route({
    method: 'GET',
    path: '/{param*}',
    handler: {
      directory: {
        path: 'public'
      }
    }
  });

  // set up index page handler
  let apiEndpoint = 
    process.env.NODE_ENV == 'production' ? 
      'https://worker-dot-' +  process.env.GCLOUD_PROJECT + '.appspot.com/go' :
      'http://localhost:8081/go';

  server.route({ 
    method: 'GET', 
    path: '/', 
    handler: (request, reply) => {
      return reply.view('index', {
        apiEndpoint: apiEndpoint,
        subscribeKey: nconf.get('pubnub_subscribe_key')
      });
    }
  });

});

// start the server
server.start((err) => {
  if (err) {
    throw err;
  }
  console.log('Server running at:', server.info.uri);

  // start listening for cats
  relay.listen();
});
