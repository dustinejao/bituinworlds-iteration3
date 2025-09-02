document.addEventListener("DOMContentLoaded", function(){ window.addEventListener( 'load', function() {
	UAGBButtonChild.init( '.uagb-block-79995c42' );
});
window.addEventListener( 'load', function() {
	UAGBButtonChild.init( '.uagb-block-ceca5614' );
});
window.addEventListener( 'load', function() {
	UAGBButtonChild.init( '.uagb-block-1593566c' );
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