/**
 * Gulpfile.
 *
 * Gulp with WordPress.
 *
 * Implements:
 *      1. Live reloads browser with BrowserSync.
 *      2. CSS: Sass to CSS conversion, error catching, Autoprefixing, Sourcemaps,
 *         CSS minification, and Merge Media Queries.
 *      3. JS: Concatenates & uglifies Vendor and Custom JS files.
 *      4. Images: Minifies PNG, JPEG, GIF and SVG images.
 *      5. Watches files for changes in CSS or JS.
 *      6. Watches files for changes in HTML.
 *      7. Corrects the line endings.
 *      8. InjectCSS instead of browser page reload.
 *
 * @author Taylor Oyer
 * @version 1.0.0
 */

/**
 * Configuration.
 *
 * Project Configuration for gulp tasks.
 *
 * In paths you can add <<glob or array of globs>>. Edit the variables as per your project requirements.
 */

// START Editing Project Variables.
// Project related.
// const project               = 'fine-ants'; // Project Name, all lowercase, no spaces
const projectURL               = 'fine-ants.work'; // Project URL. Could be something like development.work
// const productURL            = './'; // Theme/Plugin URL. Leave it like it is, since our gulpfile.js lives in the root folder.
// const tunnel-name            = project.toLowerCase();

// Style related.
const styleSRC                 = './assets/sass/main.scss'; // Path to main .scss file.
const styleDestination         = './static/frontend/css/'; // Path to place the compiled CSS file.

// JS Custom related.
const jsCustomSRC              = './assets/js/*.js'; // Path to JS custom scripts folder.
const jsCustomDestination      = './static/frontend/js/'; // Path to place the compiled JS custom scripts file.
const jsCustomFile             = 'app'; // Compiled JS custom file name.

// JS Vendor related.
const jsVendorSRC              = [
                                    './node_modules/jquery/dist/jquery.slim.js',
                                    './node_modules/bootstrap/dist/js/bootstrap.bundle.js',
                                    './node_modules/axios/dist/axios.js',
                                    './assets/js/plugins/chartist.js',
                                ];
const jsVendorDestination      = './static/frontend/js/'; // Path to place the compiled JS vendors file.
const jsVendorFile             = 'vendor'; // Compiled JS vendors file name.

// Images related.
const imagesSRC                = './assets/img/**/*.{png,jpg,jpeg,gif,svg}'; // Source folder of images which should be optimized.
const imagesDestination        = './static/frontend/img/'; // Destination folder of optimized images. Must be different from the imagesSRC folder.

// Fonts relate.
const fontsSRC                 = './assets/fonts/**/*.{eot,woff,woff2,otf,svg,ttf}'; // Source folder of images which should be optimized.
const fontsDestination         = './static/frontend/fonts/'; // Destination folder of optimized images. Must be different from the imagesSRC folder.

// Watch files paths.
const styleWatchFiles          = './assets/sass/**/*.scss'; // Path to all *.scss files inside css folder and inside them.
const vendorJSWatchFiles       = './assets/js/plugins/*.js'; // Path to all vendor JS files.
const customJSWatchFiles       = './assets/js/*.js'; // Path to all custom JS files.
const projectHTMLWatchFiles     = './**/*.html'; // Path to all HTML files.
const imagesWatchFiles         = './assets/img/**/*.{png,jpg,jpeg,gif,svg}';
// const fontsWatchFiles          = fontsSRC;

// Browsers you care about for autoprefixing.
// Browser list https://github.com/ai/browserslist
const AUTOPREFIXER_BROWSERS = [
    'last 2 version', // last 2 versions of each browser
    'not dead', // browsers that are actively worked on
    '>= 1%' // only browsers that have greater than or equal to at least 1% usage worldwide
];

// END Editing Project Variables.

/**
 * Load Plugins.
 *
 * Load gulp plugins and assign them semantic names.
 */
const gulp                = require('gulp'); // Gulp of-course

// CSS related plugins.
const sass                = require('gulp-sass'); // Gulp plugin for Sass compilation.
const cleanCSS            = require('gulp-clean-css'); // Minifies CSS files.
const purgecss            = require('@fullhuman/postcss-purgecss') // Remove unused CSS
const autoprefixer        = require('gulp-autoprefixer'); // Autoprefixing magic.
const mmq                 = require('gulp-merge-media-queries'); // Combine matching media queries into one media query definition.
const postcss             = require('gulp-postcss'); // Used to manage CSS

// JS related plugins.
const concat              = require('gulp-concat'); // Concatenates JS files
const uglify              = require('gulp-uglify'); // Minifies JS files
const babel               = require('gulp-babel'); // Converts ES6 to ES5 and polyfills

// Image related plugins.
const imagemin            = require('gulp-imagemin'); // Minify PNG, JPEG, GIF and SVG images with imagemin.
const del                 = require('del');
const newer               = require('gulp-newer');

// Utility related plugins.
const gutil               = require('gulp-util');
const rename              = require('gulp-rename'); // Renames files E.g. style.css -> style.min.css
const lineec              = require('gulp-line-ending-corrector'); // Consistent Line Endings for non UNIX systems. Gulp Plugin for Line Ending Corrector (A utility that makes sure your files have consistent line endings)
const filter              = require('gulp-filter'); // Enables you to work on a subset of the original files by filtering them using globbing.
const rev                 = require('gulp-rev'); // Creates a hashed version of the file for cache busting.
const sourcemaps          = require('gulp-sourcemaps'); // Maps code in a compressed file (E.g. style.css) back to it’s original position in a source file (E.g. structure.scss, which was later combined with other css files to generate style.css)
const browserSync         = require('browser-sync').create(); // Reloads browser and injects CSS. Time-saving synchronised browser testing.
const reload              = browserSync.reload; // For manual browser reload.



/**
 * Task: `browser-sync`.
 *
 * Live Reloads, CSS injections, Localhost tunneling.
 *
 * This task does the following:
 *    1. Sets the project URL
 *    2. Sets inject CSS
 *    3. You may define a custom port
 *    4. You may want to stop the browser from opening automatically
 */
gulp.task('browser-sync', function (done) {
    browserSync.init({
        // For more options
        // @link http://www.browsersync.io/docs/options/
        // files: [
        //   watchAllFiles,
        // ],
        open: 'local',
        // logConnections: false,
        // host: projectURL,
        proxy: projectURL,
        injectChanges: true
        // online: true,
        // tunnel: tunnel-name
    });
    done();
});


/**
 * Task: `development-styles`.
 *
 * Compiles and writes CSS file with sourcemap for development
 *
 * This task does the following:
 *    0. Deletes old CSS and Map files
 *    1. Gets the source css and scss files and concatenates them together
 *    2. Compiles Sass to CSS
 *    3. Generates TailwindCSS code based on config file
 *    4. Adds a random hash to the file name for cache busting
 *    5. Writes Sourcemaps for the file
 *    6. Cleans up line endings
 *    7. Writes file to assets folder
 *    8. Writes file name to rev-manifest.json
 *    9. Writes rev-manifest.json to assets folder (or merges it in existing file)
 *    10. Filters and streams new css file to the browser
 */
gulp.task('development-styles', function (done) {
    // del(cssDeletionPath);
    // del(cssMapDeletionPath);
    gulp.src(styleSRC)
        .pipe( sourcemaps.init() )
        // .pipe(concat(cssCustomFile + '.scss'))
        .pipe(sass({
            errLogToConsole: true,
            outputStyle: 'expanded',
            precision: 10
        }))
        .on('error', console.error.bind(console))
        // .pipe(rev()) // Create new revision number for cache busting
        .pipe( sourcemaps.write ( './' ) )
        .pipe(lineec()) // Consistent Line Endings for non UNIX systems.
        .pipe(gulp.dest(styleDestination)) // Write css file to assets
        // .pipe(rev.manifest(manifestPath, {merge: true})) // Merge revisioned files into one manifest
        .pipe(gulp.dest('.')) // Write revisions manifest to assets
        // .pipe(filter('**/*.css')) // Filtering stream to only css files
        // .pipe(browserSync.stream()) // Reloads main.css if that is enqueued.
    done(); // call the function at the top to let Gulp know the process has finished
});

/**
 * Task: `production-styles`.
 *
 * Compiles and writes and minifies CSS file for production environment
 *
 * This task does the following:
 *    0. Deletes old CSS and Map files
 *    1. Gets the source CSS and SCSS files and concatenates them together
 *    2. Compiles SCSS to CSS
 *    3. Generates TailwindCSS code based on config file
 *    4. Merges media queries together
 *    5. Finds and removes unused CSS declarations
 *    6. Autoprefixes CSS for all browsers
 *    7. Cleans up line endings
 *    8. Minifies the CSS
 *    9. Adds a random hash to the file name for cache busting
 *    10. Writes file to assets folder
 *    11. Writes file name to rev-manifest.json
 *    12. Writes rev-manifest.json to assets folder (or merges it in existing file)
 */
gulp.task('production-styles', function (done) {
    // del(cssDeletionPath);
    // del(cssMapDeletionPath);
    gulp.src(styleSRC)
        // .pipe(concat(cssCustomFile + '.scss'))
        .pipe(sass({
            errLogToConsole: true,
            outputStyle: 'expanded',
            precision: 10
        }))
        .on('error', console.error.bind(console))
        .pipe(mmq()) // Merge Media Queries only for production version.
        .pipe(postcss([
            purgecss({content: [projectHTMLWatchFiles]}), // Remove all CSS classes not used in a blade
        ]))
        .pipe(autoprefixer(AUTOPREFIXER_BROWSERS)) // Autoprefix only for minified version to avoid sourcemap conflicts
        .pipe(lineec()) // Consistent Line Endings for non UNIX systems.
        .pipe(cleanCSS()) // Minify the CSS
        // .pipe(rev()) // Create new revision number for cache busting
        .pipe(gulp.dest(styleDestination)) // Write css file to assets
        // .pipe(rev.manifest(manifestPath, {merge: true})) // Merge revisioned files into one manifest
        .pipe(gulp.dest('.')) // Write revisions manifest to assets
    done(); // call the function at the top to let Gulp know the process has finished
});

/**
 * Task: `devCustomJS`.
 *
 * Concatenate custom JS scripts.
 *
 * This task does the following:
 *     0. Deletes any existing custom JS files
 *     1. Gets the source folder for JS custom files
 *     2. Concatenates all the files and generates custom JS file
 *     3. Processes javascript through babel to convert to normal javascript
 *     4. Uglifies/Minifies the JS file and generates custom JS file
 *     5. Cleans up line endings
 *     6. Adds random hash to file name for cache busting
 *     7. Writes file to assets folder
 *     8. Writes file name to revision manifest
 *     9. Writes rev-manifest.json to assets folder (or merges it in existing file)
 */
gulp.task('devCustomJS', function (done) {
    // del(jsDeletionPath);
    gulp.src(jsCustomSRC)
        .pipe(concat(jsCustomFile + '.js'))
        .pipe(babel({presets: ['@babel/preset-env']})) // Run babel conversion and polyfills for new JS
        .pipe(lineec()) // Consistent Line Endings for non UNIX systems.
        // .pipe(rev()) // Create new revision number for cache busting
        .pipe(gulp.dest(jsCustomDestination))
        // .pipe(rev.manifest(manifestPath, {merge: true})) // Merge revisioned files into one manifest
        .pipe(gulp.dest('.')); // Write revisions manifest to assets
    done();
});

/**
 * Task: `customJS`.
 *
 * Concatenate and uglify custom JS scripts.
 *
 * This task does the following:
 *     0. Deletes any existing custom JS files
 *     1. Gets the source folder for JS custom files
 *     2. Concatenates all the files and generates custom JS file
 *     3. Processes javascript through babel to convert to normal javascript
 *     4. Uglifies/Minifies the JS file and generates custom JS file
 *     5. Cleans up line endings
 *     6. Adds random hash to file name for cache busting
 *     7. Writes file to assets folder
 *     8. Writes file name to revision manifest
 *     9. Writes rev-manifest.json to assets folder (or merges it in existing file)
 */
gulp.task('customJS', function (done) {
    // del(jsDeletionPath);
    gulp.src(jsCustomSRC)
        .pipe(concat(jsCustomFile + '.js'))
        .pipe(babel({presets: ['@babel/preset-env']})) // Run babel conversion and polyfills for new JS
        .pipe(uglify().on('error', gutil.log)) // Minify javascript
        .pipe(lineec()) // Consistent Line Endings for non UNIX systems.
        // .pipe(rev()) // Create new revision number for cache busting
        .pipe(gulp.dest(jsCustomDestination))
        // .pipe(rev.manifest(manifestPath, {merge: true})) // Merge revisioned files into one manifest
        .pipe(gulp.dest('.')); // Write revisions manifest to assets
    done();
});

/**
 * Task: `vendorJS`.
 *
 * Concatenate and uglify vendor JS scripts.
 *
 * This task does the following:
 *     0. Deletes any existing vendor JS files
 *     1. Gets the source folder for JS vendor files
 *     2. Concatenates all the files and generates custom JS file
 *     3. Uglifies/Minifies the JS file and generates custom JS file
 *     4. Cleans up line endings
 *     5. Adds random hash to file name for cache busting
 *     6. Writes file to assets folder
 *     7. Writes file name to revision manifest
 *     8. Writes rev-manifest.json to assets folder (or merges it in existing file)
 */
gulp.task('vendorJS', function (done) {
    // del(jsVendorDeletionPath);
    gulp.src(jsVendorSRC)
        .pipe(concat(jsVendorFile + '.js'))
        .pipe(uglify().on('error', gutil.log)) // Minify javascript
        .pipe(lineec()) // Consistent Line Endings for non UNIX systems.
        // .pipe(rev()) // Create new revision number for cache busting
        .pipe(gulp.dest(jsVendorDestination))
        // .pipe(rev.manifest(manifestPath, {merge: true})) // Merge revisioned files into one manifest
        .pipe(gulp.dest('.')); // Write revisions manifest to assets
    done();
});

/**
 * Tasks: 'clean-img ,`images`
 *
 * Deletes all images in dist folder.
 * Minifies PNG, JPEG, GIF and SVG images.
 *
 * This task does the following:
 *     1. Gets the source of images raw folder
 *     2. Minifies PNG, JPEG, GIF and SVG images
 *     3. Generates and saves the optimized images
 *
 * This task will run only once, if you want to run it
 * again, do it with the command `gulp img`.
 */
gulp.task('clean-img', function (cb) {
    return del(imagesDestination, cb);
});

gulp.task('images', function (done) {
    gulp.src(imagesSRC)
        .pipe(newer(imagesDestination))
        .pipe(imagemin([
            imagemin.gifsicle({interlaced: true}),
            imagemin.mozjpeg({progressive: true}),
            imagemin.optipng({optimizationLevel: 7}),
            imagemin.svgo({plugins: [{removeViewBox: true}]})
        ], {
            verbose: true
        }))
        .pipe(gulp.dest(imagesDestination));
    done();
});


/**
 * Task: 'fonts'
 *
 * Move custom fonts to distribution
 *
 * This task does the following:
 *     1. Gets the fonts in source folder
 *     2. Moves them to destination folder
 *
 */
gulp.task('fonts', function (done) {
    gulp.src(fontsSRC)
        .pipe(gulp.dest(fontsDestination));
    done();
});

/**
 * Default Task
 *
 * Processes and builds out development files for css, javascript, fonts and images.
 */
gulp.task('default', gulp.series(gulp.parallel('development-styles', 'devCustomJS', 'vendorJS'), 'clean-img', 'images'));

/**
 * Development Task
 *
 * Processes and builds out development files for css and javascript.
 */
gulp.task('development', gulp.parallel('development-styles', 'devCustomJS'));

/**
 * Build Task
 *
 * Processes and builds out distribution files.
 */
gulp.task('production', gulp.series(gulp.parallel('production-styles', 'customJS', 'vendorJS'), 'clean-img', 'images'));

/**
 * Image Task
 *
 * Processes and optimizes image files.
 */
gulp.task('handle-images', gulp.series('clean-img', 'images'));

/**
 * Watch Tasks.
 *
 * Watches for file changes and runs related tasks.
 * Spins up Browsersync to enable live updates to the browser.
 */
gulp.task('watch:css', function(done) {
    gulp.watch(styleWatchFiles).on('change', gulp.series('development-styles'));
    done();
});

gulp.task('watch:files', function(done) {
    gulp.watch(projectHTMLWatchFiles).on('change', gulp.series(reload)); // Reload on HTML file changes.
    gulp.watch(customJSWatchFiles).on('change', gulp.series('devCustomJS', reload)); // Reload on customJS file changes.
    gulp.watch(vendorJSWatchFiles).on('change', gulp.series('vendorJS', reload)); // Reload on vendorJs file changes.
    gulp.watch(imagesWatchFiles).on('change', gulp.series('clean-img', 'images', reload)); // Reload on image file changes.
    gulp.watch(fontsWatchFiles).on('change', gulp.series('fonts', reload)); // Reload on font file changes.
    done();
});

gulp.task('watch', gulp.parallel('browser-sync', 'watch:css', 'watch:files'));