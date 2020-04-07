let gulp = require('gulp'),
	sass = require('gulp-sass'),
	cleancss = require('gulp-clean-css'),
	browserSync = require('browser-sync'),
	uglify = require('gulp-uglify'),
	concat = require('gulp-concat'),
	rename = require('gulp-rename'),
	del = require('del'),
	autoprefixer = require('gulp-autoprefixer');

// SCSS compiler
gulp.task('scss', function () {
	return gulp.src('app/scss/**/*.scss')
		.pipe(sass({ outputStyle: 'expanded' }))
		.pipe(autoprefixer(['last 15 versions']))
		.pipe(rename({
			suffix: '.min'
		}))
		.pipe(cleancss({ level: { 1: { specialComments: 0 } } })) // Opt., comment out when debugging
		.pipe(gulp.dest('app/css'))
		.pipe(browserSync.reload({
			stream: true
		}))
});

gulp.task('css-libs', function () {
	return gulp.src([
		'node_modules/normalize.css/normalize.css',
		'node_modules/magnific-popup/dist/magnific-popup.css',
		//'node_modules/bootstrap/dist/css/bootstrap-grid.css',
		'node_modules/font-awesome/css/font-awesome.css',
	])
		.pipe(concat('_libs.scss'))
		.pipe(gulp.dest('app/scss'))
		.pipe(browserSync.reload({
			stream: true
		}))
})

// HTML Live Reload
gulp.task('html', function () {
	return gulp.src('app/**/*.html')
		.pipe(browserSync.reload({
			stream: true
		}))
});

// JS
gulp.task('js', function () {
	return gulp.src([
		'node_modules/jquery/dist/jquery.min.js',
		'node_modules/magnific-popup/dist/jquery.magnific-popup.js',
		'app/libs/filterizr/jquery.filterizr.js',
		'app/js/common.js', // Always at the end
	])
		.pipe(concat('scripts.min.js'))
		.pipe(uglify())
		.pipe(gulp.dest('app/js'))
		.pipe(browserSync.reload({
			stream: true
		}))
})

// Static server
gulp.task('browser-sync', function () {
	browserSync.init({
		server: {
			baseDir: "app/"
		}
	});
});

//Build
gulp.task('export', async function () {
	let buildHtml = gulp.src('app/**/*.html')
		.pipe(gulp.dest('dist'))

	let buildCss = gulp.src('app/css/**/*.css')
		.pipe(gulp.dest('dist/css'))

	let buildJs = gulp.src('app/js/**/*.js')
		.pipe(gulp.dest('dist/js'))

	let buildFonts = gulp.src('app/fonts/**/*.*')
		.pipe(gulp.dest('dist/fonts'))

	let buildImg = gulp.src('app/img/**/*.*')
		.pipe(gulp.dest('dist/img'))
})

gulp.task('clean', async function () {
	del.sync('dist')
})

gulp.task('build', gulp.series('clean', 'export'))

// Deploy
// gulp.task('rsync', function () {
// 	return gulp.src('dist/**')
// 		.pipe(rsync({
// 			root: 'app/',
// 			hostname: 'username@yousite.com',
// 			destination: 'yousite/public_html/',
// 			// include: ['*.htaccess'], // Includes files to deploy
// 			exclude: ['**/Thumbs.db', '**/*.DS_Store'], // Excludes files from deploy
// 			recursive: true,
// 			archive: true,
// 			silent: false,
// 			compress: true
// 		}))
// });

gulp.task('watch', function () {
	gulp.watch('app/scss/**/*.scss', gulp.parallel('scss'))
	gulp.watch('app/**/*.html', gulp.parallel('html'))
	gulp.watch('app/js/common.js', gulp.parallel('js'))
});

gulp.task('default', gulp.parallel('css-libs', 'scss', 'js', 'browser-sync', 'watch'))