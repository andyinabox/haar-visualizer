var p5 = require('p5')
	, parseHaarCascade = require('./parseHaarCascade.js');


var canvas;
var img;

var sketch = function(p) {


	p.preload = function() {
		img = p.loadImage('data/female-averaged-cropped.jpg');
	}

	p.setup = function() {
		canvas = p.createCanvas(600, 600);

		p.loadXML('data/haarcascade_frontalface_default.xml', parseHaarCascade);

	}

	p.draw = function() {
		p.background(0);
		p.image(img, 0, 0, p.width, p.height);
	}

}

function err() {
	throw new Error('Error!', arguments);
}

new p5(sketch);