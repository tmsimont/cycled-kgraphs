
/** 
 * Cn is an array of K-graphs [2,2,2] = k2,k2,k2
 * The cycle size is the number of elements in Cn
 *
 * Note: comments referencing "original cycle" mean the 
 * non-converted cycle of size N "old" vertices.
 * The "transformed" cycle is the cycle that has each
 * "new" vertex transformed to K graphs
 */
function adjacencyMatrix(Cn) {
	var matrix = [];
	
	// count the number of vertices 
	// (dont' just do cycle size * k size, we might have different k sizes at some point)
	var totalCount = 0;
	for (var i = 0; i < Cn.length; i++)
		for (var j = 0; j < Cn[i]; j++)
			totalCount++;
	
	// we need to calculate a "new index" for each vertex in the original cycle
	var newIndex = 0;
	
	// we know there are totalCount number of new vertices
	for (var i = 0 ; i < totalCount; i++) {
		
		// Cn[i] is the K graph size at this "old" vertex
		for (var j = 0; j < Cn[i]; j++) {
			
			// initialize the matrix row
			matrix[newIndex] = [];
			
			// initialize all adjacencies to 0
			for (var k = 0; k < totalCount; k++)
				matrix[newIndex][k] = 0;
			
			// calculate the shift from [newIndex][0] for this grouping of adjacencies
			var shift = (i-1) * Cn[(i-1+Cn.length)%Cn.length];
			shift = (shift + totalCount)%totalCount;
			
			// put the shifted group into the matrix
			for (var k = shift; k < shift+3*Cn[i]; k++) {
				var subidx = k%totalCount;
				if (subidx != newIndex) {
					matrix[newIndex][subidx] = 1;
				}
			}
			
			// increment the next new index
			newIndex++;
		}
	}
	
	return matrix;

}

function splitMatrix(matrix, ksize) {
	var splits = [];
	for (var i = 1; i <= ksize; i+=2) {
		
		// create a new copy of matrix as new split
		var split = [];
		for (var j = 0; j < matrix.length; j++) {
			split[j] = [];
			for (var k = 0; k < matrix[j].length; k++) {
				split[j][k] = matrix[j][k];
			}
		}
		
		// zero out the cross diagonal at this i size
		for (var x = 0; x < matrix.length; x++) {
			split[x][(x+i)%split[x].length] = 0;
			split[x][((x-i)+split[x].length)%split[x].length] = 0;
		}
		
		// track split
		splits.push(split);
	}
	return splits;
}


// ------------------- TESTS ---------------------

// C3[2,2,2]
var C32 = [2,2,2];


// C5[2,2,2,2,2]
var C52 = [2,2,2,2,2];

// C3[3,3,3,3,3]
var C53 = [3,3,3,3,3];


console.log(adjacencyMatrix([2,2,2,2,2]));
//console.log(adjacencyMatrix(C52));
//console.log(adjacencyMatrix(C53));

console.log(splitMatrix(adjacencyMatrix(C53), 6));