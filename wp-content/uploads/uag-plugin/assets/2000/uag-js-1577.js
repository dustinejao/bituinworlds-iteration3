document.addEventListener("DOMContentLoaded", function(){ window.addEventListener( 'load', function() {
	UAGBButtonChild.init( '.uagb-block-1bc9a55e' );
});
window.addEventListener( 'load', function() {
	UAGBButtonChild.init( '.uagb-block-cbfc1247' );
});
window.addEventListener( 'load', function() {
	UAGBButtonChild.init( '.uagb-block-8de81795' );
});
window.addEventListener( 'load', function() {
	UAGBButtonChild.init( '.uagb-block-bee97926' );
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