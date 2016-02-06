module.exports = function parseHaarCascade(data) {
	var root = data.querySelector('haarcascade_frontalface_default');
	var size = root.querySelector('size').innerHTML.split(' ');

	// returns type HTMLCollection
	var stages = root.querySelector('stages').children;

	var i;
	for(i = 0; i < stages.length; i++) {
		var trees = stages[i].querySelector('trees').children;

		var j;
		for(j = 0; j < trees.length; j++) {
			var nodes = trees[j].children;

			var k;
			for(k = 0; k < nodes.length; k++) {
				var node = parseHaarNode(nodes[k]);

				console.log('node', node);
				// console.log('node', rects, tilted, threshold, left_val, right_val);

			}

		}

	}


	// console.log(root, size, stages);

}

function parseHaarNode(node) {

	var optional = [
		'left_val'
		, 'right_val'
		, 'left_node'
		, 'right_node'
	];

	var parsed = {
		rects: parseRects(node.querySelector('rects'))
		, tilted: !!node.querySelector('tilted').innerHTML
		, threshold: parseFloat(node.querySelector('threshold').innerHTML)
	}

	// add optional attributes
	optional.forEach(function(s){
		var el = node.querySelector(s);
		if(el) {
			parsed[s] = parseFloat(el.innerHTML);
		}
	});

	return parsed;
}

function parseRects(node) {
	var rects = []
		, i;

	for(i = 0; i < node.children.length; i++) {
		rects.push(
			node.children[i].innerHTML
				.split(' ')
				.map(function(d) { return parseInt(d); })
		);
	}

	return rects;
}

