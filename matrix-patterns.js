var matrix, ksize, mainwrap, swapshowing;

function getTablelizedMatrix(matrix, ksize) {
	// generate wrapper
	var wrap = $("<div />");
	wrap.addClass("table-wrapper");
	
	// generate table
	var table = $("<table />");
	
	var size = matrix.length;
	
	// build into rows and cols
	for (var i = 0; i < matrix.length; i++) {
		var row = $("<tr />");
		
		var every_other_dist = 0;
		for (var j = 0; j < matrix[i].length; j++) {
			var col = $("<td />");
			
			col.text(matrix[i][j]);
			
			// add classes...
			col.data("k-groups",[]);
			
			// striping out from main diagonal
			for (var x = 0; x < size/2; x++) {
				if (j == (i+x)%size || j == (i-x+size)%size) {
					col.addClass("diag-"+(x)+"-dist");
					col.data("diag",x);
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
					var groups = col.data("k-groups");
					groups.push(x);
					col.data("k-groups",groups);
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
				var groups = col.data("k-groups");
				groups.push(x);
				col.data("k-groups",groups);
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
	ksize = descriptor[0]+descriptor[1];
	matrix = adjacencyMatrix(descriptor);
	mainwrap = getTablelizedMatrix(matrix, ksize);
	$("#table-container").append(mainwrap);
	applyEvents(mainwrap);
}

function applyEvents(matrixWrap) {
	
	for(var i = 0; i < 10; i++) {
		$(matrixWrap).find(".k-group-"+i).click(function() {
			if (document.getElementById('showkgroups').checked) {
				var groups = $(this).data("k-groups");
				for (var k = 0; k < groups.length; k++) {
					$("#table-container .k-group-"+groups[k]).toggleClass("show-k-group-"+groups[k]);
				}
			}
		});
	}
	
	
	for(var i = 0; i < 10; i++) {
		$(matrixWrap).find(".diag-"+i+"-dist").click(function() {
			if (document.getElementById('showstripes').checked) {
				var diag = $(this).data("diag");
				$("#table-container .diag-"+diag+"-dist").toggleClass("show-diag");
			}
		});
	}
}

var sidebaring = false;
$(document).ready(function() {
	
	$("#sidebarbutton").click(function() {
		if (!sidebaring) {
			sidebaring=true;
			$("#table-container").hide();
			$("#sidebar").show();
			
		}
		else {
			sidebaring=false;
			$("#table-container").show();
			$("#sidebar").hide();
		}
	});
	
	$("#s1").click(function() {
		$(this).hide();
		$("#s2").show();
	})
	$("#s2").click(function() {
		$(this).hide();
		$("#s3").show();
	})
	$("#s3").click(function() {
		$(this).hide();
		$("#s1").show();
	})
	
	
	selectsForC();
	
	$("#showkgroups").click(function() {
		document.getElementById("showstripes").checked = false;
	})
	$("#showstripes").click(function() {
		document.getElementById("showkgroups").checked = false;
	})
	
	
	$("#csize").change(function() {
		selectsForC();
	});
	$("#restart").click(function() {
		location.reload();
	});
	$("#go").click(function() {
		$("#go").hide();
		$("#restart").show();
		$("#presentation-controls").show();
		$("select").attr("disabled","disabled");
		generate();
	});
	$("#split").click(function(){
		document.getElementById("showstripes").checked = false;
		document.getElementById("showkgroups").checked = false;
		$("#table-container .show-diag").removeClass("show-diag");
		for (var i =0; i < 10; i++) {
			$("#table-container .show-k-group-"+i).removeClass("show-k-group-"+i);
		}
		$("#split").hide();
		$("#split-controls").show();
		var splits = splitMatrix(matrix, ksize);
		mainwrap.hide();
		for (var i = 0; i < splits.length; i++) {
			var matrixWrap = getTablelizedMatrix(splits[i], ksize);
			matrixWrap.addClass("split");
			matrixWrap.addClass("split-"+i);
			$("#table-container").append(matrixWrap);
			applyEvents(matrixWrap);
		}
		
		$("#breakit").click(function() {
			var done = 0;
			for (var i = 0; i < splits.length-1; i++) {
				$(".split-"+i).slideUp("fast","linear",function() {
					done++;
					if (done == splits.length-1) {
						$(".split-"+done).hide();
						mainwrap.show();
						$("#breakit").hide();
						$("#swap").show();
						swapshowing = 0;
						$("#swap").click(function() {
							$("#swap").hide();
							$("#backswap").show();
							mainwrap.find(".diag-"+((2*swapshowing)+1)+"-dist").addClass("show-diag");
							$(".split-"+swapshowing).find(".diag-"+((2*swapshowing)+1)+"-dist").addClass("show-diag");
							setTimeout(function() {
								mainwrap.hide();
								$(".split-"+swapshowing).show();
								$(".split-"+swapshowing).find(".show-diag").removeClass(".show-diag");
							}, 1000);
						});
						$("#backswap").click(function() {
							$("#swap").show();
							$("#backswap").hide();
							$(".split-"+swapshowing).hide();
							$(mainwrap).find(".show-diag").removeClass("show-diag");
							mainwrap.show();
							swapshowing++;
							if (swapshowing > splits.length-1) {
								$("#swap").hide();
							}
						});
					}
				});
			}
		});
	});
});