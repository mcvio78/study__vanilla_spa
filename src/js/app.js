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
		// error   --->   Error: Request failed with status code 500

		// error.response   --->  data: {title: "An unexpected error occurred", message: "invalid_base_currency"}

		// error.response.data   --->   {title: "An unexpected error occurred", message: "invalid_base_currency"}

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
		let loader = loaderTemplate();
		el.html(loader);

		try {
			// Load Currency Ratesconst
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

	router.add('/exchange', () => {
		let html = exchangeTemplate();
		el.html(html);
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
