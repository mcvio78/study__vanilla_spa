require('dotenv').config();
const axios = require('axios');

const api = axios.create({
  baseURL: 'https://free.currconv.com/api/v7',
  timeout: Number(process.env.TIMEOUT || 5000)
});

// !!! Important interceptors !!!
api.interceptors.request.use((config) => {
  config.params = config.params || {};
  config.params['apiKey'] = process.env.APY_KEY_CURRENCYCONVERTER;
  return config;
});

module.exports = {
  convertCurrency: async (from, to) => {
    const response = await api.get(`/convert?q=${from}_${to}&compact=y`);
    const key = Object.keys(response.data)[0];
    const { val } = response.data[key];
    return { rate: val };
  }
};
