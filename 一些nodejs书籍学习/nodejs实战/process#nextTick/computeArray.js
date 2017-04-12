// 找出两个数组之间公共的元素 返回给callback
function computeArray (arr1, arr2, callback) {
	let bigArray = arr1.length > arr2.length ? arr1 : arr2;
	let smArray = bigArray == arr1 ? arr2 : arr1;
	let bigLength = bigArray.length;
	let smLength = smArray.length;
	var startIndex = 0;
	let index = 10;
	var result = [];
	function reArray() {
		for (var i = startIndex;i < (startIndex + index) &&i < bigLength; i++) {
			for (var j = 0; j < smLength; j++) {
				if (bigArray[i] == smArray[j]) {
					result.push(smArray[j]);
				}
			}
		}
		if (i >= bigLength) {
			callback(null,result)
		} else {
			startIndex += index;
			process.nextTick(reArray)
		}
	}
	reArray();
}
arr1 = [1,23124,1241,2,52,523,52,626737,5745,568,6856,8567,4,42,42,44,211,234,2342,352,52,52,525,234141,41,4124,1241,31,31,41,41,13,13,1314,1];
arr2 = [312,3124,124,123,325,324,1,412,31,25,3,1231,541,41];
computeArray(arr1,arr2, (error,result) => {
	if (error) {
		console.log(error)
	} else {
		console.log(result)
	}
})