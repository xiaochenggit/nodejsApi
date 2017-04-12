function route (handle, pathName) {
	console.log(`我们正在进入:${pathName}`);
	if (typeof handle[pathName] === 'function') {
		handle[pathName]();
	} else {
		console.log(`没找到:${pathName}`);
	}
}
exports.route = route;