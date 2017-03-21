var xc = {

}
xc.reverse = function (text) {
	if (text) {
		return text.split('').reverse().join('');
	}else{
		throw  'must be string';
	}
}
module.exports = xc;