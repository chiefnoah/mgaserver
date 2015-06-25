var jf = require('jsonfile');
var util = require('util');

var file = './config.json';

var config = jf.readFileSync(file);

	var getConfig = function() {
		return config;
	};

	var updateConfig = function(newConfig) {
		jf.writeFileSync(file, newConfig);
	};

module.exports = {
	getConfig: getConfig,
	updateConfig: updateConfig
};