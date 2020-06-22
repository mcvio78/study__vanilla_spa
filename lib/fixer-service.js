require('dotenv').config();
const axios = require('axios');

const symbols = process.env.SYMBOLS || 'EUR,USD,GPB';

// Axios Client declaration [(1)cloud services fixer]
const api = axios.create({
  baseURL: 'http://data.fixer.io/api',
  timeout: Number(process.env.TIMEOUT || 5000)
});

// !!! Important interceptors !!!
api.interceptors.request.use((config) => {
  config.params = config.params || {};
  config.params['access_key'] = process.env.API_KEY_FIXER;
  return config;
});

// Generic GET request function
const get = async (url) => {
  const response = await api.get(url);

  const { data } = response;
  if (data.success) {
    return data;
  }
  // Throw an Error with data.error = { code: 201, type: 'invalid_base_currency' }
  // POSSIBLE VALUES: data.error.type | data.error.code
  // data.error.type = 'invalid_base_currency'
  throw new Error(data.error.type);
};

module.exports = {
  // Specific GET request: function + latest, symbols, base = Euro
  getRates: () => get(`/latest&symbols=${symbols}&base=EUR`),
  getSymbols: () => get('/symbols'),
  // Get Historical Rates
  getHistoricalRate: date => get(`/${date}&symbols=${symbols}&base=EUR`),
};

//--------------------------------------------------------------------------------------------------ERROR HANDLER STEP 1
// >>> IF DATA.SUCCESS <<< ( .then or if  or try )
//
// RESPONSE:  {
// 	status: 200,
//  statusText: 'OK',
//  headers: {...},
//	config: {...},
//	request: {...},
// 	ClientRequest:{...},
//  data: {
//      success: true,
//      timestamp: 1583304906,
//      base: 'EUR',
//      date: '2020-03-04',
//      rates: {
//         EUR: 1,
//         USD: 1.115772,
//         GBP: 0.870643,
//         AUD: 1.690038,
//         BTC: 0.000127,
//         KES: 114.303254,
//         JPY: 119.81495,
//         CNY: 7.772135 }
//         }
// 	}

// >>> ELSE <<< ( .catch or else try/catch)
//
//--- previous code ---
// data: {
// 		success: false,
// 		error: {
// 			code: 201, type: 'invalid_base_currency'
// 		}
// }
