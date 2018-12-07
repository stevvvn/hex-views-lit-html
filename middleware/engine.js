'use strict';

const { html } = require('../index');
const fs = require('fs');

module.exports = ({ app, conf }) => {
	const layoutPath = `${ conf.get('paths.launch') }/views/layouts`;
	const cache = { '_layouts': {} };
	const getTemplate = (path, cached) => {
		if (cached) {
			if (!cache[path]) {
				cache[path] = require(path);
			}
			return cache[path];
		}
		return require(path);
	};
	const getLayout = (type, cached) => {
		if (cached) {
			if (!cache._layouts[path]) {
				cache._layouts[path] = require(`${ layoutPath }/${ type }`);
			}
			return cache._layouts[path];
		}
		return require(`${ layoutPath }/${ type }`);
	};

	app.engine('js', (path, opts, cb) => {
		try {
			const res = getTemplate(path, opts.cache)(html, opts);
			const layout = getLayout(res.layout, opts.cache);
			cb(null, layout(html, res));
		}
		catch (ex) {
			cb(ex);
		}
	});
	app.set('view engine', 'js');
};
