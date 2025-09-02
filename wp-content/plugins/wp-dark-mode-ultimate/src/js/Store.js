/**
 * Store class to handle cookies
 * WP Dark Mode
 */

class Store {
	static prefix = 'wp-dark-mode-';
	static set(key, value, daysToExpire = 365) {
		key           = `${Store.prefix}${key}`;
		const expires = daysToExpire ? `expires = ${new Date( Date.now() + daysToExpire * 24 * 60 * 60 * 1000 ).toUTCString()};` : '';
		document.cookie = `${key} = ${encodeURIComponent( value )};${expires}path = / `;

		return this
	}

	static get(key) {
		key           = `${Store.prefix}${key}`;
		const cookies = document.cookie.split( ';' );
		for (const cookie of cookies) {
			const [cookieKey, cookieValue] = cookie.split( '=' ).map( item => item.trim() );
			if (cookieKey === key) {
				return decodeURIComponent( cookieValue );
			}
		}
		return null;
	}

	static delete(key) {
		key             = `${Store.prefix}${key}`;
		document.cookie = `${key} = ; expires = Thu, 01 Jan 1970 00:00:00 UTC; path = / ;`;

		return this
	}
}

export default Store;