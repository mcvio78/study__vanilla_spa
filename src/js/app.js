import './../sass/main.scss';

//Load event is fired when all dependent resources such as stylesheets and images have been loaded.
window.addEventListener('load', () => {
	const el = $('#app');

	// Compile Handlebar Templates
	const errorTemplate = Handlebars.compile($('#error-template').html());
	const ratesTemplate = Handlebars.compile($('#rates-template').html());
	const exchangeTemplate = Handlebars.compile($('#exchange-template').html());
	const historicalTemplate = Handlebars.compile($('#historical-template').html());

	// const html = ratesTemplate();
	// el.html(html);

	// Router Declaration
	const router = new Router({
		mode: 'history',
		// Default: Callback function for 404 page
		page404: (path) => {
			const html = errorTemplate({
				color: 'yellow',
				title: 'Error 404 - Page NOT Found!',
				message: `The path '/${path}' does not exist on this site`,
			});
			// Render error template
			el.html(html);
		},
	});

	router.add('/', () => {
		let html = ratesTemplate();
		el.html(html);
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
