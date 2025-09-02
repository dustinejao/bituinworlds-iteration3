document.addEventListener("DOMContentLoaded", function(){ window.addEventListener("DOMContentLoaded", function(){
	UAGBForms.init( {"block_id":"381babeb","reCaptchaEnable":false,"reCaptchaType":"v2","reCaptchaSiteKeyV2":"","reCaptchaSecretKeyV2":"","reCaptchaSiteKeyV3":"","reCaptchaSecretKeyV3":"","afterSubmitToEmail":"bituinworlds@gmail.com","afterSubmitCcEmail":"","afterSubmitBccEmail":"","afterSubmitEmailSubject":"Form Submission","sendAfterSubmitEmail":true,"confirmationType":"message","hidereCaptchaBatch":false,"captchaMessage":"Please fill up the above captcha.","confirmationUrl":""}, '.uagb-block-381babeb', 100 );
});
window.addEventListener( 'load', function() {
	UAGBButtonChild.init( '.uagb-block-4199bd53' );
});
window.addEventListener( 'load', function() {
	UAGBButtonChild.init( '.uagb-block-d0e5b7b9' );
});
window.addEventListener( 'load', function() {
	UAGBButtonChild.init( '.uagb-block-713879a7' );
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