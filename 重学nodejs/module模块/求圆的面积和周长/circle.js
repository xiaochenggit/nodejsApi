const PI = Math.PI;
var circle = {};
circle.area = function (r) {
	return PI * r * r ;
}
circle.perimeter = function (r) {
	return 2 * PI * r ;
}
module.exports = circle;