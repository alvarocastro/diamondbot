const escape = function (text) {
	return text.replace(/(\\:`_\*)/ig, '\\$1');
}

export default {
	escape
};
export {
	escape
};
