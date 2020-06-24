'use strict';

const Hapi = require('@hapi/hapi');
const {getAddresses} = require("./controller");
const PROVIDER_URL = 'https://provider-go.herokuapp.com/';

const init = async () => {

    const server = Hapi.server({
        port: process.env.PORT || 3000,
        host: '0.0.0.0'
    });

    server.route({
        method: 'GET',
        path: '/',
        handler: () => getAddresses(PROVIDER_URL)
    });

    await server.start();
    console.log('Server running on %s', server.info.uri);
};

process.on('unhandledRejection', (err) => {

    console.log(err);
    process.exit(1);
});

(async () => await init())();
