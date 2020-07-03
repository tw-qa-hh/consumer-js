import * as path from 'path';
import {Pact, Matchers} from '@pact-foundation/pact';
import {Publisher} from "@pact-foundation/pact-node";
import {getAddresses} from './controller';

const {somethingLike, eachLike } = Matchers;

const mockedProviderHost = 'localhost';
const mockedProviderPort = 1234;
const pathToPacts = path.resolve(process.cwd(), 'pacts');

const provider = new Pact({
    consumer: 'consumer-js',
    provider: 'provider-go',
    host: mockedProviderHost,
    port: mockedProviderPort,
    log: path.resolve(process.cwd(), 'logs', 'pact.log'),
    dir: pathToPacts,
    logLevel: 'WARN',
    spec: 2,
    ssl: false,
    pactfileWriteMode: "update"
});

const brokerOpts = {
    pactFilesOrDirs: [pathToPacts],
    pactBroker: 'https://qa-ham-pact-broker.herokuapp.com/',
    consumerVersion: process.env.GIT_SHA || '1.0.0',
    tags: ['master', 'consumer-js']
};

const publisher = new Publisher(brokerOpts);

const expectedBody = eachLike({
    ID: somethingLike('js'),
    ZipCode: somethingLike('ZipCode'),
    Street: somethingLike('Street')
}, { min: 1 });

const interaction = {
    uponReceiving: 'a request for addressess',
    withRequest: {
        method: 'GET',
        path: '/',
    },
    willRespondWith: {
        status: 200,
        headers: {
            'Content-Type': 'application/json'
        },
        body: expectedBody
    }
};

beforeAll(() => {
    return provider.setup();
});

beforeEach(() => {
    return provider.addInteraction(interaction);
});

afterEach(() => {
    return provider.finalize()
});

afterAll(() => {
    return publisher.publish();
})

test('can retrieve list of addresss', async () => {
    const response = await getAddresses(`http://${mockedProviderHost}:${mockedProviderPort}`);
    expect(response.meta.status).toBe(200);
    expect(response.body).toBeInstanceOf(Array);
    return provider.verify()
});
