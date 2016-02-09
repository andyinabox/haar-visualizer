var html = require('simple-html-index')
	, pkg = require('./package.json');

html({title: pkg.name + ' ' + pkg.version, entry: 'bundle.js', css: 'styles.css'}).pipe(process.stdout);
