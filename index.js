const clean = require('flow-remove-types');

module.exports = function (fly, utils) {
  fly.plugin('unflow', {every: false}, function * (files, opts) {
  	opts = Object.assign({pretty: true, all: true}, opts);

  	files.forEach(file => {
	  	const out = clean(file.data, opts);
	  	file.data = Buffer.from(data);
  	});
  });
};
