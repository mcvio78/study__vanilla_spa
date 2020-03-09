import './../sass/main.scss';

//Load event is fired when all dependent resources such as stylesheets and images have been loaded.
window.addEventListener('load', () => {
	const el = $('#app');

	/* eslint-disable */
	// Compile Handlebar Templates
	const errorTemplate = Handlebars.compile($('#handlebars-error-template').html());
	const ratesTemplate = Handlebars.compile($('#handlebars-rates-template').html());
	const exchangeTemplate = Handlebars.compile($('#handlebars-exchange-template').html());
	const historicalTemplate = Handlebars.compile($('#handlebars-historical-template').html());
	const loaderTemplate = Handlebars.compile($('#handlebars-loader-template').html());
	/* eslint-enable */

	// const html = ratesTemplate();
	// el.html(html);

	//--------------------------------------------------------------------------------------------------------------LOADER
	const loader = loaderTemplate();

	// Router Declaration
	const router = new Router({ /* eslint-disable-line */
		mode: 'history',
		// Default: Callback function for 404 page
		page404: (path) => {
			const html = errorTemplate({
				title: 'Error 404 - Page NOT Found!',
				message: `The path '/${path}' does not exist on this site`,
			});
			// Render error template
			el.html(html);
		},
	});

	// Instantiate api handler
	// API client for communicating with our proxy server [(2)proxy server]
	const api = axios.create({ /* eslint-disable-line */
		baseURL: 'http://localhost:3000/api',
		timeout: 5000,
	});

	// Display Error Banner - destructuring variables {title, message} mount errorTemplate passing red, title and message.
	const showError = error => {

		//----------------------------------------------------------------------------------------------ERROR HANDLER STEP 5
		// error   --->   Error: Request failed with status code 500   FROM res.status(500)

		// error.response   --->  data: {title: "An unexpected error occurred", message: "invalid_base_currency"}   .send({ ... })

		// error.response.data   --->   {title: "An unexpected error occurred", message: "invalid_base_currency"}   .send({ ... })

		//---------------------------------------------------------------------DESTRUCTURING AND SEND IT INSIDE HANDLEBARS 6
		const { title, message } = error.response.data;
		const html = errorTemplate({ title, message });

		el.html(html);

		const errorPage = $('#error-page');
		errorPage.addClass('server-error');
	};

	/**
	 *******************************************************************************************************CURRENCY RATES
	 */
	// Display Latest Currency Rates
	router.add('/', async () => {

		// Display loader first
		let html = ratesTemplate();

		// McFix try to avoid fouc.
		el.html(loader);

		try {
			// Load Currency Rates const
			// Call PROXY SERVER = http://localhost:3000/
			// Call APIs PROXY SERVER = http://localhost:3000/api ( in this case /rates )
			const response = await api.get('/rates');
			// DESTRUCTURING = base: EUR, date: 2020-03-03, rates: EUR: 1, USD: 1.11625..
			const { base, date, rates } = response.data;

			// Di'/rates'// Display Rates Table
			html = ratesTemplate({ base, date, rates });
			el.html(html);

		} catch (error) {
			//--------------------------------------------------------------------------------------------ERROR HANDLER STEP 4
			// Call show error function error handler.
			// NODE default error handler (err, req, res, next)
			// error = Error: Request failed with status code 500 because ( res.status(500).send({ title:... )
			showError(error);
		} finally {

			// Remove loader status
			//$('.loading').removeClass('loading');
		}
	});

	// // Perform POST request, calculate and display conversion results
	// const getConversionResults = async () => {
	//
	// 	// Extract form data
	// 	const from = $('#from').val();
	// 	const to = $('#to').val();
	// 	const amount = $('#amount').val();
	//
	// 	// Send post data to Express(proxy) server
	// 	try {
	// 		const response = await api.post('/convert', { from, to });
	// 		const { rate } = response.data;
	// 		const result = rate * amount;
	// 		$('#result').html(`${to} ${result}`);
	// 	} catch (error) {
	// 		showError(error);
	// 	} finally {
	// 		el.html(html);
	// 	}
	// };

	// Handle Convert Button Click Event
	const convertRatesHandler = () => {

		// Specify Form Validation Rules
		const validateForm = () => {
			const from = document.forms.exchange_form.from;
			const to = document.forms.exchange_form.to;
			const amount = document.forms.exchange_form.amount;
			const amountValue = amount.value;

			const re = new RegExp('[0][0-9]', 'g');

			const errorModal = $('.error-modal');
			errorModal.css('display','flex');
			const errorNotification = $('.error-notification');
			const closeModal = $('.close-modal');

			closeModal.click(event => {
				event.preventDefault();
				errorModal.css('display','none');
			});

			if (from.value === '') {
				errorNotification.text('from must be filled out');
				//alert('from must be filled out');
				return false;
			}
			if (to.value === '') {
				errorNotification.text('to must be filled out');
				//alert('to must be filled out');
				return false;
			}
			if(amountValue <= 0){
				errorNotification.text('amount must be filled out with a number greater than zero');
				//alert('amount must be filled out with a number greater than zero');
				return false;
			}
			if(amountValue.match(re)){
				errorNotification.text('amount can\'t start with zero');
				//alert('amount can\'t start with zero');
				return false;
			}
			if (amountValue - Math.floor(Number(amountValue)) !== 0 ) {
				errorNotification.text('amount must be decimal');
				//alert('amount must be decimal');
				return false;
			}
			errorModal.css('display','none');
			return true;
		};

		const validateResult = validateForm();

		if (validateResult) {

			// Hide error notification modal
			// hide error message
			// $('.ui.error.message').hide();

			// Loader
			//$('#result-segment').addClass('loading');
			el.html(loader);

			// Post to express server
			//getConversionResults();

			// Prevent page from submitting to server
			return false;

		}
		return true;
	};

	/**
	 *******************************************************************************************************EXCHANGE RATES
	 */
	router.add('/exchange', async() => {

		// McFix try to avoid fouc.
		el.html(loader);

		try {
			// Load Symbols
			const response = await api.get('/symbols');
			// {
			// 	"success": true,
			// 	"symbols": {
			// 	"AED": "United Arab Emirates Dirham",
			// 		"AFN": "Afghan Afghani",
			// 		"ALL": "Albanian Lek",
			// 		"AMD": "Armenian Dram",
			// 	}
			// }
			const { symbols } = response.data;
			const html = exchangeTemplate({ symbols });
			el.html(html);

			// Reset fields
			document.forms.exchange_form.from = '';
			document.forms.exchange_form.to = '';
			document.forms.exchange_form.amount = '';

			// Specify Submit Handler
			$('.submit-button').click(event => {
				event.preventDefault();
				convertRatesHandler();
			});
		} catch (error) {
			showError(error);
		}
	});

	router.add('/historical', () => {
		let html = historicalTemplate();
		el.html(html);
	});

	// Navigate app to current url(pathname = /, /exchange, /historical)
	router.navigateTo(window.location.pathname);

	// Highlight Active Menu on Refresh/Page Reload
	const link = $(`a[href$='${window.location.pathname}']`);
	link.addClass('active');
	$('a').on('click', (event) => {

		// Block browser page load
		event.preventDefault();

		// Highlight Active Menu on Click
		const target = $(event.target);

		// Remove to all items active class
		$('.item').removeClass('active');

		// Add active class only to a clicked item
		target.addClass('active');

		// Navigate to clicked url:
		// jQuery .attr sets/gets attribute in this case gets href: /, /exchange, /historical
		const href = target.attr('href');

		// extract part of string start on href.lastIndexOf('/')
		const path = href.substr(href.lastIndexOf('/'));

		// navigate to /, /exchange, /historical
		router.navigateTo(path);
	});
});
