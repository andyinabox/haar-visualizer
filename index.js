var p5 = require('p5')
	, parseHaarCascade = require('./parseHaarCascade.js');


var canvas;
var img;
var _data;
var stage = 0;

var sketch = function(p) {


	p.preload = function() {
		img = p.loadImage('data/female-averaged-cropped.jpg');
	}

	p.setup = function() {
		canvas = p.createCanvas(600, 600);

		p.loadXML('data/haarcascade_frontalface_default.xml', xmlLoaded);

	}

	p.draw = function() {
		p.background(0);
		p.image(img, 0, 0, p.width, p.height);
	
		if(_data && _data.flattened) {
			var nodes = _data.flattened;
			for(var i = 0; (i < stage && i < nodes.length); i++) {
				drawHaarRects(nodes[i], _data.sampleSize);
			}
		}

		p.keyReleased = function() {
			stage++;
		}

	}


	function xmlLoaded(data) {
		_data = parseHaarCascade(data);
		_data.flattened = [];

		_data.stages.forEach(function(trees) {
			trees.forEach(function(nodes, j) {
				nodes.forEach(function(node, k) {
					_data.flattened.push(node);
				});
			});
		});

		console.log('xmlLoaded', _data);
	}

	function drawHaarRects(node, sampleSize) {

		p.noStroke();

		node.rects.forEach(function(r) {
			var weight = r[4];
			// black or white based on weight
		 
			// console.log('weight', weight);

			var c = p.color(255, 255, 255, 100); 

			if(weight < 0) {
				c = p.color(0, 0, 0, 100);
			}

			var x = p.map(r[0], 0, sampleSize[0], 0, p.width);
			var y = p.map(r[1], 0, sampleSize[1], 0, p.height);
			var w = p.map(r[2], 0, sampleSize[0], 0, p.width);
			var h = p.map(r[3], 0, sampleSize[1], 0, p.height);

			p.fill(c);
			p.rect(x, y, w, h);

		});
	}

}



function err() {
	throw new Error('Error!', arguments);
}

new p5(sketch);