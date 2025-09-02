document.addEventListener("DOMContentLoaded", function(){ window.addEventListener( 'load', function() {
	UAGBButtonChild.init( '.uagb-block-jgesbatl' );
});
window.addEventListener( 'load', function() {
	UAGBButtonChild.init( '.uagb-block-rjigskqz' );
});
window.addEventListener( 'load', function() {
	UAGBButtonChild.init( '.uagb-block-hdqmsgko' );
});
				window.addEventListener( 'DOMContentLoaded', () => {
					const blockScope = document.querySelector( '.uagb-block-5076973a' );
					if ( ! blockScope ) {
						return;
					}

					const anchorElement = blockScope.querySelector('a');
					if (!anchorElement) {
						return;
					} 

					 
					blockScope.addEventListener('keydown', (event) => {
						if ( 13 === event.keyCode || 32 === event.keyCode ) {
							event.preventDefault();
							 
							anchorElement.click();	
						}
					} );
				} );
			 });