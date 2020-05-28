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
 *      6. Watches files for changes in PHP.
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
// var project               = 'fine-ants'; // Project Name, all lowercase, no spaces
var projectURL               = 'fine-ants.work'; // Project URL. Could be something like development.work
// var productURL            = './'; // Theme/Plugin URL. Leave it like it is, since our gulpfile.js lives in the root folder.
// var tunnel-name            = project.toLowerCase();

// Style related.
var styleSRC                 = './assets/sass/main.scss'; // Path to main .scss file.
var styleDestination         = './static/frontend/css/'; // Path to place the compiled CSS file.

// JS Custom related.
var jsCustomSRC              = './assets/js/*.js'; // Path to JS custom scripts folder.
var jsCustomDestination      = './static/frontend/js/'; // Path to place the compiled JS custom scripts file.
var jsCustomFile             = 'main'; // Compiled JS custom file name.

// JS Vendor related.
var jsVendorSRC              = ['./assets/js/plugins/testing.js', './assets/js/plugins/boilerplate.js'];
var jsVendorDestination      = './static/frontend/js/'; // Path to place the compiled JS vendors file.
var jsVendorFile             = 'plugins'; // Compiled JS vendors file name.

// Images related.
var imagesSRC                = './assets/img/**/*.{png,jpg,jpeg,gif,svg}'; // Source folder of images which should be optimized.
var imagesDestination        = './static/frontend/img/'; // Destination folder of optimized images. Must be different from the imagesSRC folder.

// Fonts relate.
var fontsSRC                 = './assets/fonts/**/*.{eot,woff,woff2,otf,svg,ttf}'; // Source folder of images which should be optimized.
var fontsDestination         = './static/frontend/fonts/'; // Destination folder of optimized images. Must be different from the imagesSRC folder.

// Watch files paths.
var styleWatchFiles          = './assets/sass/**/*.scss'; // Path to all *.scss files inside css folder and inside them.
var vendorJSWatchFiles       = './assets/js/plugins/*.js'; // Path to all vendor JS files.
var customJSWatchFiles       = './assets/js/*.js'; // Path to all custom JS files.
var projectHTMLWatchFiles     = './**/*.html'; // Path to all PHP files.
var imagesWatchFiles         = './assets/img/**/*.{png,jpg,jpeg,gif,svg}';
// var fontsWatchFiles          = fontsSRC;

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
var gulp                = require('gulp'); // Gulp of-course

// CSS related plugins.
var sass                = require('gulp-sass'); // Gulp plugin for Sass compilation.
var cleanCSS            = require('gulp-clean-css'); // Minifies CSS files.
var purgecss            = require('@fullhuman/postcss-purgecss') // Remove unused CSS
var autoprefixer        = require('gulp-autoprefixer'); // Autoprefixing magic.
var mmq                 = require('gulp-merge-media-queries'); // Combine matching media queries into one media query definition.
var postcss             = require('gulp-postcss'); // Used to manage CSS

// JS related plugins.
var concat              = require('gulp-concat'); // Concatenates JS files
var uglify              = require('gulp-uglify'); // Minifies JS files
var babel               = require('gulp-babel'); // Converts ES6 to ES5 and polyfills

// Image related plugins.
var imagemin            = require('gulp-imagemin'); // Minify PNG, JPEG, GIF and SVG images with imagemin.
var del                 = require('del');
var newer               = require('gulp-newer');

// Utility related plugins.
var gutil               = require('gulp-util');
var rename              = require('gulp-rename'); // Renames files E.g. style.css -> style.min.css
var lineec              = require('gulp-line-ending-corrector'); // Consistent Line Endings for non UNIX systems. Gulp Plugin for Line Ending Corrector (A utility that makes sure your files have consistent line endings)
var filter              = require('gulp-filter'); // Enables you to work on a subset of the original files by filtering them using globbing.
var sourcemaps          = require('gulp-sourcemaps'); // Maps code in a compressed file (E.g. style.css) back to it’s original position in a source file (E.g. structure.scss, which was later combined with other css files to generate style.css)
var browserSync         = require('browser-sync').create(); // Reloads browser and injects CSS. Time-saving synchronised browser testing.
var reload              = browserSync.reload; // For manual browser reload.



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
 * Task: `styles`.
 *
 * Compiles Sass to CSS, Autoprefixes it and Minifies CSS.
 *
 * This task does the following:
 *    1. Gets the source scss file
 *    2. Compiles Sass to CSS
 *    3. Writes Sourcemaps for it
 *    4. Autoprefixes it and generates main.css
 *    5. Renames the CSS file with suffix .min.css
 *    6. Minifies the CSS file and generates main.min.css
 *    7. Injects CSS or reloads the browser via browserSync
 */
gulp.task('styles', function (done) {
    gulp.src(styleSRC)
        .pipe( sourcemaps.init() )
        .pipe(sass({
            errLogToConsole: true,
            outputStyle: 'expanded',
            precision: 10
        }))
        .on('error', console.error.bind(console))
        .pipe( sourcemaps.write ( './' ) )
        .pipe(lineec()) // Consistent Line Endings for non UNIX systems.
        .pipe(gulp.dest(styleDestination))
        .pipe(filter('**/*.css')) // Filtering stream to only css files
        .pipe(browserSync.stream()) // Reloads main.css if that is enqueued.
        .pipe(mmq()) // Merge Media Queries only for .min.css version.
        .pipe(rename({suffix: '.min'}))
        .pipe(postcss([
            purgecss({content: [projectHTMLWatchFiles]}),
        ]))
        .pipe(autoprefixer(AUTOPREFIXER_BROWSERS)) // Autoprefix only for minified version to avoid sourcemap conflicts
        .pipe(cleanCSS())
        .pipe(lineec()) // Consistent Line Endings for non UNIX systems.
        .pipe(gulp.dest(styleDestination))
        .pipe(filter('**/*.css')) // Filtering stream to only css files
        .pipe(browserSync.stream()); // Reloads main.min.css if that is enqueued.
        done(); // call the function at the top to let Gulp know the process has finished
});


/**
 * Task: `customJS`.
 *
 * Concatenate and uglify custom JS scripts.
 *
 * This task does the following:
 *     1. Gets the source folder for JS custom files
 *     2. Concatenates all the files and generates custom.js
 *     3. Renames the JS file with suffix .min.js
 *     4. Uglifes/Minifies the JS file and generates custom.min.js
 */
gulp.task('customJS', function (done) {
    gulp.src(jsCustomSRC)
        .pipe(concat(jsCustomFile + '.js'))
        .pipe(lineec()) // Consistent Line Endings for non UNIX systems.
        .pipe(babel({presets: ['@babel/preset-env']}))
        .pipe(gulp.dest(jsCustomDestination))
        .pipe(rename({
            basename: jsCustomFile,
            suffix: '.min'
        }))
        .pipe(uglify().on('error', gutil.log))
        .pipe(lineec()) // Consistent Line Endings for non UNIX systems.
        .pipe(gulp.dest(jsCustomDestination));
    done();
});


/**
 * Task: `vendorJS`.
 *
 * Concatenate and uglify vendor JS scripts.
 *
 * This task does the following:
 *     1. Gets the source folder for JS vendor files
 *     2. Concatenates all the files and generates vendors.js
 *     3. Renames the JS file with suffix .min.js
 *     4. Uglifes/Minifies the JS file and generates vendors.min.js
 */
gulp.task('vendorsJs', function (done) {
    console.log(jsVendorSRC);
    gulp.src(jsVendorSRC)
        .pipe(concat(jsVendorFile + '.js'))
        .pipe(lineec()) // Consistent Line Endings for non UNIX systems.
        .pipe(gulp.dest(jsVendorDestination))
        .pipe(rename({
            basename: jsVendorFile,
            suffix: '.min'
        }))
        .pipe(uglify().on('error', gutil.log))
        .pipe(lineec()) // Consistent Line Endings for non UNIX systems.
        .pipe(gulp.dest(jsVendorDestination));
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
 * Processes and builds out distribution files for css and javascript.
 */
gulp.task('default', gulp.parallel('styles', 'customJS', 'vendorsJs'));


/**
 * Build Task
 *
 * Processes and builds out distribution files.
 */
gulp.task('build', gulp.series(gulp.parallel('styles', 'customJS', 'vendorsJs', 'fonts'), 'clean-img', 'images'));



/**
 * Image Task
 *
 * Processes and optimizes image files.
 */
gulp.task('img', gulp.series('clean-img', 'images'));

/**
 * CSS Task
 *
 * Processes sass and css files.
 */
gulp.task('css', gulp.series('styles'));

/**
 * Javascript Task
 *
 * Processes javascript files.
 */
gulp.task('js', gulp.series('customJS', 'vendorsJs'));

/**
 * Watch Tasks.
 *
 * Watches for file changes and runs related tasks.
 * Spins up Browsersync to enable live updates to the browser.
 */
gulp.task('watch:css', function() {
    gulp.watch(styleWatchFiles).on('change', gulp.series('styles'));
});

gulp.task('watch:files', function() {
    gulp.watch(projectHTMLWatchFiles).on('change', gulp.series(reload)); // Reload on PHP file changes.
    gulp.watch(vendorJSWatchFiles).on('change', gulp.series('vendorsJs', reload)); // Reload on vendorsJs file changes.
    gulp.watch(customJSWatchFiles).on('change', gulp.series('customJS', reload)); // Reload on customJS file changes.
    gulp.watch(imagesWatchFiles).on('change', gulp.series('clean-img', 'images', reload)); // Reload on image file changes.
    // gulp.watch(fontsWatchFiles).on('change', gulp.series('fonts', reload)); // Reload on font file changes.
});

gulp.task('watch', gulp.series('default', gulp.parallel('browser-sync', 'watch:css', 'watch:files')));