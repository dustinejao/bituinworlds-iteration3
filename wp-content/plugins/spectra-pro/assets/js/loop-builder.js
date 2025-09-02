	// Function to scroll to the div element with the query ID
    function scrollToQueryId( queryId ) {
		const targetElement = document.getElementById( `uagb-block-queryid-${queryId}` );
		
        if ( targetElement ) {
			const rect = targetElement.getBoundingClientRect();
			const adminBar = document.querySelector( '#wpadminbar' );
			const adminBarOffSetHeight = adminBar?.offsetHeight || 0;
			const scrollTop = window?.pageYOffset || document?.documentElement?.scrollTop;
			const targetOffset = ( rect?.top + scrollTop ) - adminBarOffSetHeight;

            window.scrollTo( {
				top: targetOffset,
				behavior: 'smooth'
            } );
        }
    }

	/**
	 * Function to find the ancestor with the given class name.
	 *
	 * @param {Element} element   The element.
	 * @param {string}  className The class name.
	 * @return {Element} The element.
	 * @since 1.2.0
	 */
	function findAncestorWithClass( element, className ) {
		while ( element && ! element.classList.contains( className ) ) {
			element = element.parentNode;
		}
		return element;
	}

	document.addEventListener( 'DOMContentLoaded', function () {
		// Debounce function to limit the rate of execution
		function debounce( func, wait ) {
			let timeout;

			return function executedFunction( ...args ) {
				const context = this;
				const later = () => {
					timeout = null;
					func.apply( context, args );
				};

				clearTimeout( timeout );
				timeout = setTimeout( later, wait );
			};
		};

		/**
		 * Function to update the loop wrapper content
		 * as per data in filters.
		 *
		 * @param {Event}  event               The event.
		 * @param {string} paged               The paged parameter for displaying a particular page on click of pagination links.
		 * @param {string} buttonFilter        The array of selected button value.
		 * @param {string} current             The current selected element value.
		 * @param {string} loopParentContainer The loop parent container.
		 * @return {Promise} The Promise.
		 * @throws {Error} The error.
		 * @since 1.2.0
		 */
		async function updateContent( event, paged = null, buttonFilter = null, current = null, loopParentContainer ) {
			try{
				const loopBuilder = loopParentContainer;
				const search = loopBuilder?.querySelector( '.uagb-loop-search' )?.value;
				const sorting = loopBuilder?.querySelector( '.uagb-loop-sort' )?.value;
				const category = current?.value;
				const categoryButtonFilterContainer = loopBuilder?.querySelector( '.uagb-loop-category-inner' );
				const formData = new FormData();
				if( search ){
					formData.append( 'search', search );
				}
				if( sorting ){
					formData.append( 'sorting', sorting );
				}
				if ( category ) {
					formData.append( 'category', category );
				}
				const checkBoxValues = loopParentContainer?.querySelectorAll( '.uagb-cat-checkbox' );
				// Initialize an array to store checked checkbox values.
				const checkedValues = [];
				checkBoxValues?.forEach( checkBoxVal => {
					// Check if the checkbox is checked.
					const isChecked = checkBoxVal.checked;
					if ( isChecked && checkBoxVal.getAttribute( 'data-uagb-block-query-id' ) === event.target.dataset.uagbBlockQueryId ) {
						// Add the value to the array.
						checkedValues.push( checkBoxVal.value );
					}
				} );
				if ( checkedValues ) {
					formData.append( 'checkbox', checkedValues );
				}
				if( paged ){
					formData.append( 'paged', paged );
				}
				if ( buttonFilter ){
					formData.append( 'buttonFilter', JSON.stringify( buttonFilter.type ) );
				}
				const queryId = event.target?.dataset?.uagbBlockQueryId || event.target?.parentElement?.dataset?.uagbBlockQueryId || categoryButtonFilterContainer?.dataset?.uagbBlockQueryId || event?.dataset?.uagbBlockQueryId || event.target.closest( 'a' )?.getAttribute( 'data-uagb-block-query-id' );
				scrollToQueryId( queryId ); // Scroll to top when ajax based pagination.
				formData.append( 'queryId', queryId );
				formData.append( 'block_id', loopBuilder?.getAttribute( 'data-block_id' ) );
				const output = await getUpdatedLoopWrapperContent( formData );
				const loopElement = loopBuilder?.querySelector( '#uagb-block-queryid-' + queryId );
				if ( loopElement && output?.content?.wrapper ) {
					loopElement.innerHTML = output.content.wrapper;
				}
				const loopPaginationContainers = loopBuilder?.querySelectorAll( '#uagb-block-pagination-queryid-'+queryId );
				if ( loopPaginationContainers && output?.content?.pagination ) {
					loopPaginationContainers.innerHTML = output?.content?.pagination;
				}
				loopPaginationContainers?.forEach( loopPaginationContainer => {
					loopPaginationContainer.innerHTML = output.content.pagination;
				} );
			} catch( error ){
				throw error;
			}
		}

		/**
		 * Handles the input event for the search functionality within the UAGB Loop Builder block.
		 * Synchronizes input values across all search inputs within the same loop builder container
		 * and triggers a content update.
		 *
		 * @param {Event} event - The input event triggered by the user.
		 * @since 1.2.0
		 */
		function handleInput( event ) {
			const loopParentContainer = this.closest( '.wp-block-uagb-loop-builder' );
			const searchInputs = loopParentContainer.querySelectorAll( '.uagb-loop-search' );
			searchInputs.forEach( searchInput => {
				if( searchInput.getAttribute( 'data-uagb-block-query-id' ) === event.target.dataset.uagbBlockQueryId ){
					searchInput.value = event.target.value;
				}
			} );
			updateContent( event, null, null, null, loopParentContainer );
		}

		/**
		 * Handles the checkbox selection within the UAGB Loop Builder block.
		 * Collects the values of all checked checkboxes that match the block query ID 
		 * and triggers a content update.
		 *
		 * @param {Event} event - The change event triggered by the user when interacting with a checkbox.
		 * @since 1.2.0
		 */
		function handleCheckBoxVal( event ) {
			const loopParentContainer = this.closest( '.wp-block-uagb-loop-builder' );
			const checkBoxValues = loopParentContainer.querySelectorAll( '.uagb-cat-checkbox' );
			// Initialize an array to store checked checkbox values.
			const checkedValues = [];
			checkBoxValues.forEach( checkBoxVal => {
				// Check if the checkbox is checked.
				const isChecked = checkBoxVal.checked;
				if ( isChecked && checkBoxVal.getAttribute( 'data-uagb-block-query-id' ) === event.target.dataset.uagbBlockQueryId ) {
					// Add the value to the array.
					checkedValues.push( checkBoxVal.value );
				}
			} );
			updateContent( event, null, null, null, loopParentContainer );
		}

		/**
		 * Handles the selection event on the search filter.
		 * Updates the value of all relevant search filter elements with the same query ID and triggers content update.
		 *
		 * @param {Event} event - The select event triggered by the user interaction.
		 * @since 1.2.0
		 */
		function handleSelect( event ) {
			const loopParentContainer = this.closest( '.wp-block-uagb-loop-builder' );
			const sortSelects = loopParentContainer.querySelectorAll( '.uagb-loop-sort' );
			sortSelects.forEach( sortSelect => {
				if( sortSelect.getAttribute( 'data-uagb-block-query-id' ) === event.target.dataset.uagbBlockQueryId ){
					sortSelect.value = event.target.value;
				}
			} );
			updateContent( event, null, null, null, loopParentContainer );
		}

		/**
		 * Handles the category selection event on a dropdown filter.
		 * Updates the value of all relevant category select elements with the same query ID and triggers content update.
		 *
		 * @param {Event} event - The select event triggered by the user interaction.
		 * @since 1.2.0
		 */
		function handleCatSelect( event ) {
			const loopParentContainer = this.closest( '.wp-block-uagb-loop-builder' );
			const categorySelects = loopParentContainer.querySelectorAll( '.uagb-loop-category' );
			categorySelects.forEach( categorySelect => {
				if ( categorySelect.getAttribute( 'data-uagb-block-query-id' ) === event.target.dataset.uagbBlockQueryId ) {
					categorySelect.value = event.target.value;
				}
			} );
			updateContent( event, null, null, this, loopParentContainer );
		}

		/**
		 * Resets the values of elements within a container based on their query ID.
		 *
		 * @param {HTMLElement} container     - The container element to search within.
		 * @param {string}      selector      - The CSS selector for the elements to reset.
		 * @param {string}      queryId       - The query ID to match.
		 * @param {Function}    resetCallback - A callback function to apply the reset logic to each element.
		 * @since 1.2.0
		 */
		function resetValues( container, selector, queryId, resetCallback ) {
			const elements = container.querySelectorAll( selector );
			elements.forEach( element => {
				const elementQueryId = element.dataset.uagbBlockQueryId;
				if ( elementQueryId === queryId ) {
					resetCallback( element );
				}
			} );
		}

		/**
		 * Handles the reset event for all filters within the loop builder block.
		 * Resets the values of search inputs, sort selects, category selects, and checkboxes to their default state.
		 *
		 * @param {Event} event - The reset event triggered by the user interaction.
		 * @since 1.2.0
		 */
		function handleReset( event ) {
			const loopParentContainer = this.closest( '.wp-block-uagb-loop-builder' );
				// Get the query ID from the event target
				let queryId = event.target.parentElement.dataset.uagbBlockQueryId;
				if ( event.target.tagName.toLowerCase() === 'a' ) {
					queryId = event.target.dataset.uagbBlockQueryId;
				} else if ( event.target.tagName.toLowerCase() === 'svg' || event.target.tagName.toLowerCase() === 'path' ) {
					queryId = event.target.closest( 'a' )?.getAttribute( 'data-uagb-block-query-id' );
				}

				// Reset the value of the filter inputs
				const loopBuilder = findAncestorWithClass( event.target.parentNode, 'wp-block-uagb-loop-builder' );

				resetValues( loopBuilder, '.uagb-loop-search', queryId, element => {
					element.value = ''; // Reset search input value
				} );

				resetValues( loopBuilder, '.uagb-loop-sort', queryId, element => {
					element.value = ''; // Reset sort select value
				} );

				resetValues( loopBuilder, '.uagb-loop-category', queryId, element => {
					element.value = ''; // Reset category select value
				} );

				resetValues( loopBuilder, '.uagb-cat-checkbox', queryId, element => {
					element.checked = false; // Uncheck category checkbox
				} );
				// Trigger the updateContent function to reflect the changes
				updateContent( event, null, null, null, loopParentContainer );
		}

		const resetButtons = document.querySelectorAll( '.uagb-loop-reset' );

		const searchInputs = document.querySelectorAll( '.uagb-loop-search' );

		searchInputs.forEach( searchInput => {
			const debouncedHandleInput = debounce( handleInput, 250 );
			searchInput.addEventListener( 'input', debouncedHandleInput );
		} );

		const sortSelects = document.querySelectorAll( '.uagb-loop-sort' );

		sortSelects.forEach( sortSelect => {
			const debouncedHandleInput = debounce( handleSelect, 250 );
			sortSelect.addEventListener( 'change', debouncedHandleInput );
		} );

		const categorySelects = document.querySelectorAll( '.uagb-loop-category' );

		categorySelects.forEach( categorySelect => {
			const debouncedHandleInput = debounce( handleCatSelect, 250 );
			categorySelect.addEventListener( 'change', debouncedHandleInput );
		} );

		// Get a reference to the checkbox element.
		const checkBoxValues = document.querySelectorAll( '.uagb-cat-checkbox' );
		checkBoxValues.forEach( checkBoxVal => {
			const debouncedHandleInput = debounce( handleCheckBoxVal, 250 );
			checkBoxVal.addEventListener( 'click', debouncedHandleInput );
		} );

		resetButtons.forEach( resetButton => {
			const debouncedHandleReset = debounce( handleReset, 250 );
			resetButton.addEventListener( 'click', debouncedHandleReset );
		} );
		
		const oldPaginations = document.querySelectorAll( '.wp-block-uagb-loop-builder > :not(.uagb-loop-pagination).wp-block-uagb-buttons' );

		oldPaginations?.forEach( function( container ) {
			// Create a new div with class "parent-container"
			const parentContainer = document.createElement( 'div' );
			parentContainer.classList.add( 'uagb-loop-pagination' );
			const queryIdPAginationLink = container.querySelector( 'a' ).getAttribute( 'data-uagb-block-query-id' );
			parentContainer.id = 'uagb-block-pagination-queryid-'+queryIdPAginationLink;

			 // Append the container content to the new div
			 parentContainer.innerHTML = container.outerHTML;

			 // Append the new div after the original container
			 container.parentNode.insertBefore( parentContainer, container.nextSibling );

			 // Remove the original container
			 container.parentNode.removeChild( container );
		} );

		const paginationContainer = document.querySelectorAll( '.uagb-loop-pagination' );

		paginationContainer.forEach( pagination => {
			pagination.addEventListener( 'click', function( event ) {
				event.preventDefault();
				const loopParentContainer = this.closest( '.wp-block-uagb-loop-builder' );
				if ( event.target.tagName.toLowerCase() === 'a' ){
					updateContent( event, event.target.dataset.uagbBlockQueryPaged, null, null, loopParentContainer );
				}
				if ( ( event.target.tagName.toLowerCase() === 'div' && event.target.parentElement.tagName.toLowerCase() === 'a' ) ) {
					updateContent( event, event.target.parentElement.dataset.uagbBlockQueryPaged, null, null, loopParentContainer );
				}
				if ( event.target.tagName.toLowerCase() === 'svg' && event.target.tagName.toLowerCase() === 'path' ) {
					updateContent( event.target.parentElement.parentElement, event?.target?.closest( 'a' )?.getAttribute( 'data-uagb-block-query-paged' ), null, null, loopParentContainer );
				}
			} );
		} );

		const categoryButtonFilterContainer = document.querySelectorAll( '.uagb-loop-category-inner ' );

		categoryButtonFilterContainer.forEach( buttons => {
			buttons.addEventListener( 'click', function ( event ) {
				event.preventDefault();
				const loopParentContainer = this.closest( '.wp-block-uagb-loop-builder' );
				if ( event.target.tagName.toLowerCase() === 'a' ) {
					updateContent( event, null, event.target.children[0].dataset, null, loopParentContainer );
				}
				if ( ( event.target.tagName.toLowerCase() === 'div' && event.target.parentElement.tagName.toLowerCase() === 'a' ) ) {
					updateContent( event, null, event.target.dataset, null, loopParentContainer );
				}
			} );
		} );
	} );

	/**
	 * Function to get the updated loop wrapper content.
	 * as per data in filters.
	 *
	 * @param {FormData} data The form data.
	 * @since 1.2.0
	 * @return {Promise} The Promise.
	 */
	function getUpdatedLoopWrapperContent( data ) {
		// Create a new FormData object
		data.append( 'action', 'uagb_update_loop_builder_content' );
		data.append( 'postId', uagb_loop_builder?.post_id );
		data.append( 'postType', uagb_loop_builder?.what_post_type );
		data.append( 'security', uagb_loop_builder?.nonce )

		// The function now returns a Promise
		return fetch( uagb_loop_builder?.ajax_url, {
			method: 'POST',
			credentials: 'same-origin',
			body: data,
		} )
		.then( response => {
			if ( ! response.ok ) {
				throw new Error( 'Network response was not ok' );
			}
			return response.json();
		} )
		.then( output => {
			if ( output.success ) {
				// Return the actual output
				return output.data;
			}
				throw new Error( output.data.message );

		} )
		.catch( error => {
			throw error; // Propagate the error
		} );
	}