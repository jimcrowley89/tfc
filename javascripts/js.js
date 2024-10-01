let year;
const lozad = window.lozad('.lozad, .poster');

/* Registers a trigger for webpage elements & resources complete loading */
window.addEventListener( "load", function() {

	const swupObj = new Swup( {

		/* Swup Options */
		animateHistoryBrowsing: false,
		animationSelector: '[class*="transition-"]',
		containers: ["#swup", "#banner"],
		cache: true,
		linkSelector:
		'a[href^="' +
		window.location.origin +
		'"]:not([data-no-swup]), a[href^="./"]:not([data-no-swup]), a[href^="#"]:not([data-no-swup])',
		skipPopStateHandling: function(event) {
			if (event.state && event.state.source == "swup") {
				return false;
			}
			return true;
		}
	} );

	swupObj.loadPage({
		url: './' + year,
		method: 'GET',
	}).catch((err) => {
		console.error(`Error loading content for year ${year}:`, err);
		document.getElementById('swup').innerHTML = '<p>Content not available for this year.</p>';
	});

	/* Registers triggers for swup content replacment */
	swupObj.on('clickLink', navBar_Click);
	swupObj.on('contentReplaced', navBar_load);
	swupObj.on('willReplaceContent', navBar_unload);

	/* Loads page based off address bar request */
	swupObj.loadPage({

		url: './' + year,
		method: 'GET',
	});

	setTimeout(function(){

		const loader = document.querySelector(".loader");
		loader.style.opacity = "0";
		setTimeout(function(){ loader.style.display = "none"; }, 500);
	},4000);
}, false );

/* Registers a trigger for webpage elements complete loading */
document.addEventListener( "DOMContentLoaded", function() {

	const stylesheet = document.querySelector('link[as="style"]');
	if (stylesheet) {
	  stylesheet.onload = function() {
		this.onload = null;
		this.rel = 'stylesheet';
		this.media = 'screen';
	  };
	}

	const preloadLink = document.querySelector('link[rel="preload"][as="style"]');

	if (preloadLink) {
	  // Listen for the 'load' event to ensure the CSS has been preloaded
	  preloadLink.addEventListener('load', function() {
		// Once the CSS is preloaded, change the rel to 'stylesheet' and apply media
		preloadLink.rel = 'stylesheet';
		preloadLink.media = 'screen';
		preloadLink.onload = null;  // Remove onload handler for good measure
	  });
	}

	let btnOffcanvas = document.getElementById( "OpenMenu" );
	let myOffcanvas = document.getElementById( "offcanvasNavigator" );
	let bsOffcanvas = new bootstrap.Offcanvas( myOffcanvas );

	/* Gets page year from address bar */
	let urlParams = new URLSearchParams( window.location.search ).get( 'year' );
	year = urlParams ? urlParams : "2024";

	// Check if the year exists in the DOM, if not throw a console warning
	if (!document.getElementById(year)) {
		console.warn(`Year ${year} is not found in the navigation.`);
		year = "2024";  // Fallback to default year
	}

	/* Prevents the link used to open the menu from navivating to a new page*/
	btnOffcanvas.addEventListener( 'click', function ( e ){

		e.preventDefault();
		e.stopPropagation();
		bsOffcanvas.toggle();
		btnOffcanvas.classList.toggle('is-active');
	});

	/* Highlights the page nav button */
	document.getElementById( year ).classList.add( "active" );
});

function navBar_load() {

	let sectList = document.getElementsByClassName( "scroll-sect" );
	let navObj	 = document.getElementById( "navBar" );
	let template = document.getElementById( "tmp_navBtn" );
	let observer = new IntersectionObserver( function( entries ) {

		entries.forEach( x => {

			if ( x.isIntersecting )
				document.getElementById( "navBtn" + x.target.id ).classList.add( "active" );
			else
				document.getElementById( "navBtn" + x.target.id ).classList.remove( "active" );
		});
	}, { threshold: [0.5] });

	/* Generates Nav Buttons Automatically Based on Class */
	for (let i = 0; i < sectList.length; i++) {

		let node = template.cloneNode(true);
		node.id = "navBtn" + sectList[i].id;
		node.classList.remove( "d-none" );
		node.firstChild.href="#" + sectList[i].id;
		node.firstChild.innerHTML = sectList[i].id;
		navObj.appendChild(node);
		observer.observe( sectList[i] );
	}

	lozad.observe();
}

function navBar_Click( event ) {

	if ( event.target.classList.contains( "nav-link" ) ) {

		const sect	= document.getElementById( event.target.innerText );
		const rect	= sect.getBoundingClientRect();
		const top	= (rect.top + window.scrollY) - 200;
		window.scroll( {top: top} );
	}
	else if ( event.target.classList.contains( "nav-item-year" ) ) {

		document.getElementById( year ).classList.remove( "active" );
		event.target.classList.add( "active" );
		year = event.target.id;
	}
}

function navBar_unload() {

	window.scroll( {top: 0} )
	document.getElementById( "navBar" ).innerHTML = '';
}



