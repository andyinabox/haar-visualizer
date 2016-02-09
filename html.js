var html = require('simple-html-index')
	, pkg = require('./package.json');

html({title: pkg.title + '' + pkg.version, entry: 'bundle.js', css: 'styles.css'}).pipe(process.stdout);
