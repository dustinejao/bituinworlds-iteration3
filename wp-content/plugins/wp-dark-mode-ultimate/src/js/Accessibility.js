import Store from "./Store"

class Accessibility {
	/**
	 * Init
	 */
	init() {
		this.initLargeFont();
		this.checkLargeFont();
	}

	/**
	 * Init large font
	 */
	initLargeFont = () => {
		if( !wp_dark_mode_json.options.typography_enabled ) return;

		const elements = document.querySelectorAll('*:not(.wp-dark-mode-ignore):not(.wp-dark-mode-switch):not(script):not(style):not(link):not(meta):not(title):not(base):not(head):not(.wp-dark-mode-switch)');

		let desiredSize = wp_dark_mode_json.options.typography_font_size;
		if( desiredSize === 'custom' ) {
			desiredSize = wp_dark_mode_json.options.typography_font_size_custom / 100;
		}

		elements.forEach(element => {
			// Bail, if any of parent has wp-dark-mode-ignore class.
			if(element.closest('.wp-dark-mode-ignore')) {
				return;
			}
			
			const fontSize = getComputedStyle(element).fontSize;

			if (fontSize) {
				// Calculate new font size
				const newFontSize = this.calculateFontSize(fontSize, desiredSize);

				// Set property
				element.style.setProperty('--wpdm-large-font-size', newFontSize);
			}
		});
	}

	/**
	 * Toggle font size
	 */
	toggleFontSize( element ) {

		if( !wp_dark_mode_json.options.typography_enabled ) return;

		const html = document.querySelector('html');

		// Is large font is active
		const isLargeFont = html.classList.contains('wp-dark-mode-large-font');

		// Toggle large font
		html.classList[isLargeFont ? 'remove' : 'add']('wp-dark-mode-large-font');

		// Is element is 
		const isActive = element.classList.contains('active');

		// Toggle active class
		element.classList[isActive ? 'remove' : 'add']('active');

		// Remember user choice
		Store.set('large-font', !isLargeFont ? 'on' : 'off');

		// Reactive other switches
		const switches = document.querySelectorAll('.wp-dark-mode-switch ._font');

		if( !switches || !switches.length ) return;

		switches.forEach( switchEl => {
			switchEl.classList[isActive ? 'remove' : 'add']('active');
		} );

	}

	
	calculateFontSize = ( size, by = 1 ) => {
		const unit = size.replace(/[0-9]/g, '');
		const value = parseFloat(size.replace(/[a-z]/g, ''));

		let newValue = 0;
		newValue = value * by;
		return `${newValue}${unit}`;
	}

	/**
	 * Check large font
	 */
	checkLargeFont = () => {

		const isLargeFont = Store.get('large-font') === 'on';

		if( isLargeFont ) {
			document.querySelector('html').classList.add('wp-dark-mode-large-font');

			// On wp-dark-mode-switches-updated event
			document.addEventListener('wp-dark-mode-switches-updated', () => {
				const switches = document.querySelectorAll('.wp-dark-mode-switch ._font');
				if( !switches || !switches.length ) return;
				switches.forEach( switchEl => {
					switchEl.classList.add('active');
				});
			});
		}
	}
}

export default new Accessibility();