import { defineConfig } from 'vite';

const path = require( 'path' );

export default defineConfig(
	{
		build: {
			rollupOptions: {
				input: {
					main: path.resolve( __dirname, 'src/index.js' ),
				},
				output: {
					entryFileNames: 'js/wp-dark-mode-ultimate.min.js',
					format: 'iife',
				},
			},

			outDir: path.resolve( __dirname, 'assets' ),
			sourcemap: true,
			minify: true,
			emptyOutDir: false,

			// watch
			watch: true,
		},
		resolve: {
			alias: {
				'@src': path.resolve( __dirname, 'src' ),
			}
		},

	}
);
