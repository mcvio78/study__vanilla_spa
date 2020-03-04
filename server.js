require('dotenv').config(); // read .env files
const express = require('express');
const { getRates } = require('./lib/fixer-service');

const app = express();
const port = process.env.PORT || 3000;

// Set dist folder as root
app.use(express.static('dist'));

// Allow front-end access to node_modules folder
app.use('/scripts', express.static(`${__dirname}/node_modules/`));

// Express Error handler
//--------------------------------------------------------------------------------------------------ERROR HANDLER STEP 3
const errorHandler = (err, req, res) => {

	if (err.response) {

		// The request was made and the server responded with a status code that falls out of the range of 2xx
		res.status(403).send({ title: 'Server responded with an error', message: err.message });

	} else if (err.request) {

		// The request was made but no response was received
		res.status(503).send({ title: 'Unable to communicate with server', message: err.message });

	} else {
		// RETURN:  err: Error: invalid_base_currency   |||   err.message: invalid_base_currency

		// Something happened in setting up the request that triggered an Error (es: data.error.type)
		// NODE default error handler (err, req, res, next)
		// NODE default returns:		Error: Request failed with status code 500
		// It sends   1) res.status(500)   and   2) {title:..., message:...}
		res.status(500).send({ title: 'An unexpected error occurred', message: err.message });
	}
};

// Fetch Latest Currency Rates - GET request to this API endpoint send data to client
// Routing in NODE.js to api/rates
app.get('/api/rates', async (req, res) => {
	try {
		// Specific GET request from fixer-service
		const data = await getRates();
		// Otherwise browser guesses what type of content it will receive
		res.setHeader('Content-Type', 'application/json');
		res.send(data);
	} catch (error) {
		//----------------------------------------------------------------------------------------------ERROR HANDLER STEP 2
		// Catch error from fixer-service (else) = throw new Error(data.error.type)
		// Error: invalid_base_currency   <-Throwed error
		errorHandler(error, req, res);
	}
});

// Redirect all traffic to index.html
app.use((req, res) => res.sendFile(`${__dirname}/dist/index.html`));

// Listen for HTTP requests on port 3000
app.listen(port, () => {
	console.log('listening on %d', port);
});

// Test with async await
// const test = async() => {
// 	const data = await getRates();
// 	console.log(data);
// };

// Test with promise
// getRates().then( response => {
// 	console.log('response: ', response)
// });
