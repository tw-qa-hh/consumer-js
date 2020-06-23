const fetch = require('fetch');

module.exports = {
    getAddresses: async (providerUrl) => {
        const res = await new Promise((resolve, reject) => {
            return fetch.fetchUrl(providerUrl, {}, (err, meta, body) => {
                if (err) {
                    return resolve('Error calling provider')
                }
                return resolve({ meta, body: JSON.parse(body) });
            });
        });
        return res;
    }
};
