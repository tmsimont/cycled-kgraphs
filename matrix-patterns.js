function getTablelizedMatrix(matrix, ksize) {
	// generate wrapper
	var wrap = $("<div />");
	
	// generate table
	var table = $("<table />");
	
	var size = matrix.length;
	
	// build into rows and cols
	for (var i = 0; i < matrix.length; i++) {
		var row = $("<tr />");
		
		for (var j = 0; j < matrix[i].length; j++) {
			var col = $("<td />");
			
			col.text(matrix[i][j]);
			
			// add classes...
			
			
			// striping out from main diagonal
			for (var x = 0; x < size/2; x++) {
				if (j == (i+x)%size || j == (i-x+size)%size) {
					col.addClass("diag-"+(x)+"-dist");
				}
			}
				
			// k-groups
			for (var x = 0; x < size/(ksize/2)-1; x++) {
				var kgroupZeroIdx = (x*(ksize/2));
				if (
					// i is in alignment with k-grouping
					i >= kgroupZeroIdx &&  i < kgroupZeroIdx + ksize
					// j is, too
					&& j-ksize < x*ksize/2 && j >= x*ksize/2 
					) {
					col.addClass("k-group-"+x);
				}
			}
				
			// k-group in corner
			if (
					// top-right
					i < ksize/2 && size - j <= ksize/2
					||
					// top-left
					i < ksize/2 && j < ksize/2
					||
					// bottom-right
					size-i <= ksize/2 && size - j <= ksize/2
					||
					// bottom-left
					size-i <= ksize/2 && j < ksize/2
				) {
				col.addClass("k-group-"+ x);
			}
			
			row.append(col);
		}
		table.append(row);
	}
	
	// put table into wrap
	wrap.append(table);
	
	// return dom elements
	return wrap;
	
}

function selectsForC() {
	var num = $("#csize").val();
	$("#k-sizes").html("");
	for (var i = 0; i < num; i++) {
		var sel = $("<select />");
		sel.attr("id", "ksize-"+i);
		sel.attr("class", "ksize-selector");
		for (var k = 2; k <= 4; k++) {
			var opt = $("<option />");
			opt.val(k);
			opt.text(k);
			sel.append(opt);
		}
		if (i > 0) {
			$("#k-sizes").append(",");
		}
		$("#k-sizes").append(sel);
	}
}

function generate() {
	var num = $("#csize").val();
	$("#table-container").html("");
	var descriptor = [];
	for (var i = 0; i < num; i++) {
		descriptor[i] = parseInt($("#ksize-"+i).val());
	}
	var ksize = num * descriptor[0];
	console.log(descriptor);
	console.log(ksize);
	var matrix = adjacencyMatrix(descriptor);
	var tablefiedMatrix = getTablelizedMatrix(matrix, ksize);
	$("#table-container").append(tablefiedMatrix);
}


$(document).ready(function() {
	
	
	//splitMatrix(matrix, 6);
	
	selectsForC();
	
	$("#csize").change(function() {
		selectsForC();
	});
	
	$("#go").click(function() {
		generate();
	});
});