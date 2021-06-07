'use strict';

/**
 * Récupération d'un paramètre en ligne de commande
 * @param key
 * @return bool|string
 */
function getArg(key) {
	let index = process.argv.indexOf(key),
		next = process.argv[index + 1]
	;
	return (index == -1) ? null : (! next || next[0] === "-") ? true : next;
};

 
const 
	pathModule = require('path'),
	gulp = require('gulp'),
	sourcemaps = require('gulp-sourcemaps'),
	minifyJS = require('gulp-terser'),
	fs = require('fs'),
	concat = require('gulp-concat'),
	webpackStream = require('webpack-stream'),
	environment = (getArg('--env') || 'development'),
	environmentsAllowed = [ 'development', 'production', ],
	withSourceMaps = (environment === 'development'),
	compressFiles = (environment !== 'development')
;

// Vérification  de l'environment
if(environmentsAllowed.indexOf(environment) == -1) {
	throw 'Environnement incorrect.';
}

/**
 * Concaténe les fichiers JavaScript et minifit le fichier final
 */
gulp.task('update-scripts', function() {
	
	let files = [],
		filePath = './resources/scripts/framework/root.js'
	;
	files.push(filePath)

	let object = gulp.src(files).pipe(webpackStream({
		mode: environment,
		output: {
			library: "RootJS",
		},
		resolve: {
			alias: {
				Classes: pathModule.resolve(__dirname, "resources/scripts/framework/classes")
			}
		}
	}));

	if(withSourceMaps) {
		object = object.pipe(sourcemaps.init());
	}
	
	object = object.pipe(concat('root.js'))
	
	// Minifit le fichier
	if(compressFiles) {
		object = object.pipe(minifyJS());
	}
	
	if(withSourceMaps) {
    	object = object.pipe(sourcemaps.write('./maps'));
    }
	
	object = object.pipe(gulp.dest('./resources/scripts'));
	
	return object;
});

gulp.task('watch', function() {
	gulp.watch('./resources/scripts/framework/**/*.js', gulp.series('update-scripts'));
});

gulp.task('update-static', gulp.series('update-scripts'));