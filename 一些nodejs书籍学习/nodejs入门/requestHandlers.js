function start () {
	console.log('运行了requestHandlers.sart');
	let startTime = new Date().getTime();
	function sleep(time){
		while (new Date().getTime() > startTime + time) {
			// statement
			console.log(new Date().getTime() - startTime);
		}
	}
	sleep(50000);
	return 'hello world';
}
function upload () {
	console.log('运行了requestHandlers.upload');
}
exports.start = start;
exports.upload = upload;