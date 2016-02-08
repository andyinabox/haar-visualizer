var p5 = require('p5')
	, dat = require('exdat')
	, parseHaarCascade = require('./parseHaarCascade.js');

var images = {
	'Average Female' : 'data/female-averaged-cropped.jpg'
	, 'Average Male' : 'data/male-averaged-cropped.jpg'
}

var params = {
	showImage: true
	, showGrid: true
	, haarOverlay: true
	, haarOpacity: 0.5
	, currentNode: 0
	, currentImage: images['Average Female']
}


var canvas;
var img;
var gui;
var _data;

var sketch = function(p) {


	p.preload = function() {
		img = p.loadImage(params.currentImage);
	}

	p.setup = function() {
		canvas = p.createCanvas(600, 600);

		p.loadXML('data/haarcascade_frontalface_default.xml', xmlLoaded);

		gui = new dat.GUI();

		gui.add(params, 'currentImage', images).onChange(function(path) {
			img = p.loadImage(path)
		});
		gui.add(params, 'showImage');
		gui.add(params, 'showGrid');
		gui.add(params, 'haarOverlay');
		gui.add(params, 'haarOpacity', 0.0, 1.0);
	}

	p.draw = function() {
		p.background(200);

		if(params.showImage) {
			p.image(img, 0, 0, p.width, p.height);
		}

		if(_data && _data.flattened) {

			if(params.showGrid) {
				drawGrid(_data.sampleSize[0], _data.sampleSize[1]);
			}

			var nodes = _data.flattened;

			if(params.haarOverlay) {
				// draw all haar shapes up to current
				for(var i = 0; (i < params.currentNode && i < nodes.length); i++) {
					drawHaarRects(nodes[i], _data.sampleSize);
				}
			} else {
				drawHaarRects(nodes[params.currentNode], _data.sampleSize);
			}
		}

		p.keyReleased = function() {
			params.currentNode++;
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

		gui.add(params, 'currentNode', 0, _data.flattened.length-1).listen();

		console.log('xmlLoaded', _data);
	}

	function drawGrid(w, h, lineColor) {
		var i, j;
		var horizSpace = p.floor(p.width/w);
		var vertSpace = p.floor(p.height/h);
		var c = lineColor || p.color(100);

		p.push();
			p.stroke(c);

			// vertical lines
			for(i = 1; i < w; i++) {
				p.line(i*horizSpace, 0, i*horizSpace, p.height);
			}

			// horizontal lines
			for(j = 1; j < h; j++) {
				p.line(0, j*vertSpace, p.width, j*vertSpace);
			}	
		p.pop();
	}


	function drawHaarRects(node, sampleSize) {

		p.noStroke();

		node.rects.forEach(function(r) {
			var weight = r[4];
			// black or white based on weight
		 
			// console.log('weight', weight);
			
			var opacity = Math.floor(params.haarOpacity*255);

			var c = p.color(255, 255, 255, opacity); 

			if(weight < 0) {
				c = p.color(0, 0, 0, opacity);
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