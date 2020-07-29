'use strict';

/**
 * Récupération d'un paramètre en ligne de commande
 * @param key
 * @return bool|string
 */
function getArg(key) {
	var index = process.argv.indexOf(key),
		next = process.argv[index + 1]
	;
	return (index == -1) ? null : (! next || next[0] === "-") ? true : next;
};

 
var gulp = require('gulp'),
	sourcemaps = require('gulp-sourcemaps'),
	minifyJS = require('gulp-terser'),
	fs = require('fs'),
	concat = require('gulp-concat'),
	environment = (getArg('--env') || 'development'),
	environmentsAllowed = [ 'development', 'production', ],
	withSourceMaps = (environment == 'development'),
	compressFiles = (environment != 'development')
;

// Vérification  de l'environment
if(environmentsAllowed.indexOf(environment) == -1) {
	throw 'Environnement incorrect.';
}

// Gestion des fichiers JavaScript
/**
 * Concaténe les fichiers JavaScript et minifit le fichier final
 */
gulp.task('update-scripts', function() {
	
	var files = [],
		directories = [ 
			'./resources/scripts/framework/classes/required/',
			'./resources/scripts/framework/classes/',
		]
	;
	
	directories.forEach(function(path) {
		var directoryFiles = fs.readdirSync(path);
		directoryFiles.forEach(function(currentFile) {
			var filePath = path + currentFile,
				fileData = fs.statSync(filePath)
			;
			if(fileData.isFile()) {
				files.push(filePath);
			}
		});
	});

	var object = gulp.src(files);

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