'use strict';
const Path = require('path');
const Hapi = require('hapi');

const server = Hapi.server({
    port: 10004,
    host: 'localhost',
    routes: {
        cors: true
    }
});

const provision = async () => {

    await server.register({
        plugin: require('hapi-pino'),
        options: {
            prettyPrint: true,
            logEvents: ['response', 'onPostStart']
        }
    });

    server.route({
        method: 'GET',
        path: '/{path*}',
        handler: function (request, h) {
            let host
            if(request.headers["x-forwarded-host"]){
                host = request.headers["x-forwarded-host"]
            }
            else{
                host = request.headers.host
            }
            return `${host}/${request.params.path} is under construction`
        }
    });

    await server.start();

    console.log('Server running at:', server.info.uri);
};

provision()