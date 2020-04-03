const fetch = require('fetch');

module.exports = {
    getAddresses: async () => {
        const res = await new Promise((resolve, reject) => {
            return fetch.fetchUrl('http://localhost:1234/', {}, (err, meta, body) => {
                if (err) {
                    return resolve('Error calling provider')
                }
                return resolve({ meta, body: JSON.parse(body) });
            });
        });
        return res;
    }
};
