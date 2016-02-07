module.exports = function parseHaarCascade(data) {
	var stages = []
		// iterators
		, i, j, k
		, trees
		, nodes;


	var root = data.querySelector('haarcascade_frontalface_default');
	var size = root.querySelector('size').innerHTML
								.split(' ')
								.map(function(d) { return parseInt(d); });


	// returns type HTMLCollection
	var stageEls = root.querySelector('stages').children;

	// iterate through stages
	for(i = 0; i < stageEls.length; i++) {
		var treeEls = stageEls[i].querySelector('trees').children;
		trees = [];

		// iterate through trees
		for(j = 0; j < treeEls.length; j++) {
			var nodeEls = treeEls[j].children;
			nodes = [];

			// iterate through nodes
			for(k = 0; k < nodeEls.length; k++) {
				var node = parseHaarNode(nodeEls[k]);
				nodes.push(node);
			}

			trees.push(nodes);
		}
		stages.push(trees)
	}


	return {
		sampleSize: size
		, stages: stages
	}

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

