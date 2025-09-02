/**
 * External Dependencies
 */

 /**
  * WordPress Dependencies
  */
 const defaultConfig = require( '@wordpress/scripts/config/webpack.config.js' );
 const webpack = require( 'webpack' );
 
 module.exports = {
     ...defaultConfig,
     ...{
         entry: {
            index: './src/index.js',
            gspbLibrary: './src/gspb-library/index.js',
            gspbSiteEditor: './src/gspb-library/site-editor.js',
            gspbCustomEditor: './src/customJS/editor/index.js',
            gspbStylebook: './src/stylebook/index.js',
            gspbMotion: './src/motion/index.js',
            gspbMotionSpring: './src/motion/spring.js',
            gspbMotionPlus: './src/motion/plus.js',
         },
         resolve: {
            fallback: {
                "http": false
            },
         },
         plugins: [
            ...defaultConfig.plugins,
            new webpack.ProvidePlugin({
                   process: 'process/browser',
            }),
        ],
     }
 }