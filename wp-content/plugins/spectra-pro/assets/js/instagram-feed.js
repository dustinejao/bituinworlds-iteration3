let spectraInstagramLoadStatus = true;

window.SpectraInstagramMasonry = {
	init( $attr, $selector ) {
		let count = 2;
		const windowHeight50 = window.innerHeight / 1.25;
		const $scope = document.querySelector( $selector );
		const loader = $scope.querySelector( '.spectra-ig-feed__control-loader' );
		const loadButton = $scope.querySelector( '.spectra-ig-feed__control-button' );
		if ( $attr.feedPagination && $attr.paginateUseLoader ) {
			window.addEventListener( 'scroll', function () {
				let mediaItem = $scope.querySelector( '.spectra-ig-feed__media-wrapper' );
				if ( ! mediaItem ) {
					mediaItem = $scope;
				}
				const boundingClientRect = mediaItem.lastElementChild.getBoundingClientRect();
				const offsetTop = boundingClientRect.top + window.scrollY;
				if ( window.pageYOffset + windowHeight50 >= offsetTop ) {
					const $args = {
						page_number: count,
					};
					const total = $attr.gridPages;
					if ( spectraInstagramLoadStatus ) {
						if ( count > total ) {
							loader.style.display = 'none';
						}
						if ( count <= total ) {
							window.SpectraInstagramMasonry.callAjax( $scope, $args, $attr, false, count );
							count++;
							spectraInstagramLoadStatus = false;
						}
					}
				}
			} );
		} else if ( $attr.feedPagination && ! $attr.paginateUseLoader ) {
			loadButton.onclick = function () {
				const total = $attr.gridPages;
				const $args = {
					total,
					page_number: count,
				};
				loadButton.classList.toggle( 'disabled' );
				if ( spectraInstagramLoadStatus ) {
					if ( count <= total ) {
						window.SpectraInstagramMasonry.callAjax( $scope, $args, $attr, true, count );
						count++;
						spectraInstagramLoadStatus = false;
					}
				}
			};
		}
	},

	createElementFromHTML( htmlString ) {
		const htmlElement = document.createElement( 'div' );
		const htmlCleanString = htmlString.replace( /\s+/gm, ' ' ).replace( /( )+/gm, ' ' ).trim();
		htmlElement.innerHTML = htmlCleanString;
		return htmlElement;
	},

	callAjax( $scope, $obj, $attr, append = false, count ) {
		const mediaData = new FormData();
		mediaData.append( 'action', 'spectra_pro_load_instagram_masonry' );
		mediaData.append( 'nonce', spectra_pro_instagram_media.spectra_pro_instagram_masonry_ajax_nonce );
		mediaData.append( 'page_number', $obj.page_number );
		mediaData.append( 'attr', JSON.stringify( $attr ) );
		fetch( spectra_pro_instagram_media.ajax_url, {
			method: 'POST',
			credentials: 'same-origin',
			body: mediaData,
		} )
			.then( ( resp ) => resp.json() )
			.then( function ( data ) {
				let element = $scope.querySelector( '.spectra-ig-feed__layout--masonry' );
				if ( ! element ) {
					element = $scope;
				}
				// eslint-disable-next-line no-undef
				const isotope = new Isotope( element, {
					itemSelector: '.spectra-ig-feed__media-wrapper',
					stagger: 10,
				} );
				isotope.insert( window.SpectraInstagramMasonry.createElementFromHTML( data.data ) );
				// eslint-disable-next-line no-undef
				imagesLoaded( element ).on( 'progress', function () {
					isotope.layout();
				} );
				spectraInstagramLoadStatus = true;
				if ( true === append ) {
					$scope.querySelector( '.spectra-ig-feed__control-button' ).classList.toggle( 'disabled' );
				}
				if ( count === parseInt( $obj.total ) ) {
					$scope.querySelector( '.spectra-ig-feed__control-button' ).style.opacity = 0;
					setTimeout( () => {
						$scope.querySelector( '.spectra-ig-feed__control-button' ).parentElement.style.display = 'none';
					}, 2000 );
				}
			} )
			.catch( function ( error ) {
				console.error( `%c${ error }`, 'color: turquoise; font-weight: bold; font-family: Raleway;' ); // eslint-disable-line no-console
			} );
	},
};

window.SpectraInstagramPagedGrid = {
	init( $attr, $selector ) {
		let count = 1;
		const $scope = document.querySelector( $selector );
		const arrows = $scope.querySelectorAll( '.spectra-ig-feed__control-arrows--grid' );
		const dots = $scope.querySelectorAll( '.spectra-ig-feed__control-dot' );
		for ( let i = 0; i < arrows.length; i++ ) {
			arrows[ i ].addEventListener( 'click', ( event ) => {
				const thisArrow = event.currentTarget;
				let page = count;
				switch ( thisArrow.getAttribute( 'data-direction' ) ) {
					case 'Prev':
						--page;
						break;
					case 'Next':
						++page;
						break;
				}
				let mediaItem = $scope.querySelector( '.spectra-ig-feed__media-wrapper' );
				if ( ! mediaItem ) {
					mediaItem = $scope;
				}
				const total = $attr.gridPages;
				const $args = {
					page_number: page,
					total,
				};
				if ( page === total || page === 1 ) {
					thisArrow.disabled = true;
				} else {
					arrows.forEach( ( ele ) => {
						ele.disabled = false;
					} );
				}
				if ( page <= total && page >= 1 ) {
					window.SpectraInstagramPagedGrid.callAjax( $scope, $args, $attr, arrows );
					count = page;
				}
			} );
		}
		for ( let i = 0; i < dots.length; i++ ) {
			dots[ i ].addEventListener( 'click', ( event ) => {
				const thisDot = event.currentTarget;
				const page = thisDot.getAttribute( 'data-go-to' );
				let mediaItem = $scope.querySelector( '.spectra-ig-feed__media-wrapper' );
				if ( ! mediaItem ) {
					mediaItem = $scope;
				}
				const $args = {
					page_number: page,
					total: $attr.gridPages,
				};
				window.SpectraInstagramPagedGrid.callAjax( $scope, $args, $attr, arrows );
				count = page;
			} );
		}
	},

	createElementFromHTML( htmlString ) {
		const htmlElement = document.createElement( 'div' );
		const htmlCleanString = htmlString.replace( /\s+/gm, ' ' ).replace( /( )+/gm, ' ' ).trim();
		htmlElement.innerHTML = htmlCleanString;
		return htmlElement;
	},

	callAjax( $scope, $obj, $attr, arrows ) {
		const mediaData = new FormData();
		mediaData.append( 'action', 'spectra_pro_load_instagram_grid_pagination' );
		mediaData.append( 'nonce', spectra_pro_instagram_media.spectra_pro_instagram_grid_pagination_ajax_nonce );
		mediaData.append( 'page_number', $obj.page_number );
		mediaData.append( 'attr', JSON.stringify( $attr ) );
		fetch( spectra_pro_instagram_media.ajax_url, {
			method: 'POST',
			credentials: 'same-origin',
			body: mediaData,
		} )
			.then( ( resp ) => resp.json() )
			.then( function ( data ) {
				let element = $scope.querySelector( '.spectra-ig-feed__layout--isogrid' );
				if ( ! element ) {
					element = $scope;
				}
				const mediaElements = element.querySelectorAll( '.spectra-ig-feed__media-wrapper' );
				// eslint-disable-next-line no-undef
				const isotope = new Isotope( element, {
					itemSelector: '.spectra-ig-feed__media-wrapper',
					layoutMode: 'fitRows',
				} );
				mediaElements.forEach( ( mediaEle ) => {
					isotope.remove( mediaEle );
					isotope.layout();
				} );
				isotope.insert( window.SpectraInstagramPagedGrid.createElementFromHTML( data.data ) );
				// eslint-disable-next-line no-undef
				imagesLoaded( element ).on( 'progress', function () {
					isotope.layout();
				} );
				if ( parseInt( $obj.page_number ) === 1 ) {
					arrows.forEach( ( arrow ) => {
						arrow.disabled = arrow.getAttribute( 'data-direction' ) === 'Prev';
					} );
				} else if ( parseInt( $obj.page_number ) === parseInt( $obj.total ) ) {
					arrows.forEach( ( arrow ) => {
						arrow.disabled = arrow.getAttribute( 'data-direction' ) === 'Next';
					} );
				} else {
					arrows.forEach( ( arrow ) => {
						arrow.disabled = false;
					} );
				}
				$scope
					.querySelector( '.spectra-ig-feed__control-dot--active' )
					.classList.toggle( 'spectra-ig-feed__control-dot--active' );
				const activeDot = $scope.querySelectorAll( '.spectra-ig-feed__control-dot' );
				if ( activeDot ) {
					activeDot[ parseInt( $obj.page_number ) - 1 ].classList.toggle(
						'spectra-ig-feed__control-dot--active'
					);
				}
			} )
			.catch( function ( error ) {
				console.error( `%c${ error }`, 'color: turquoise; font-weight: bold; font-family: Raleway;' ); // eslint-disable-line no-console
			} );
	},
};
