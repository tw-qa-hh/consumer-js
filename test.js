import * as path from 'path';
import { Pact, Matchers } from '@pact-foundation/pact';
import {getAddresses} from './controller';
const { somethingLike } = Matchers;

const provider = new Pact({
    consumer: 'consumer-js',
    provider: 'provider-go',
    host: 'localhost',
    port: 1234,
    log: path.resolve(process.cwd(), 'logs', 'pact.log'),
    dir: path.resolve(process.cwd(), 'pacts'),
    logLevel: 'WARN',
    spec: 2,
    ssl: false,
    pactfileWriteMode: "update"
});


const expectedBody = [{
    zipCode:  somethingLike('00000')
}];

const interaction = {
    uponReceiving: 'a request for addressess',
    withRequest: {
        method: 'GET',
        path: '/',
    },
    willRespondWith: {
        status: 200,
        headers: {
            'Content-Type': 'application/json; charset=utf-8'
        },
        body: expectedBody
    }
};

beforeAll(() => {
   return  provider.setup();
});

beforeEach(() => {
    return provider.addInteraction(interaction);
});

afterEach(() => {
    return provider.finalize()
});

test('can retrieve list of addresss', async () => {
    const response = await getAddresses();
    expect(response.meta.status).toBe(200);
    expect(response.body).toBeInstanceOf(Array);
    return provider.verify()
});
