'use strict';

const { html } = require('../index');
const fs = require('fs');

module.exports = ({ app, conf }) => {
	const layoutPath = `${ conf.get('paths.launch') }/views/layouts`;
	const handleCache = (path, cache) => {
		if (cache) {
			return path;
		}
		const resolved = require.resolve(path);
		delete require.cache[resolved];
		return resolved;
	};

	// views/x/y.js
	const getTemplate = (path, cache) =>
		require(handleCache(path, cache));

	// views/layouts/x.js
	const getLayout = (type, cache) =>
		require(handleCache(`${ layoutPath }/${ type }`, cache));

	app.engine('js', (path, opts, cb) => {
		try {
			// should take (html, opts) as an argument in module.exports and return { layout: string } and other keys
			// depending on the whims of the layout (e.g., for an html layout maybe 'body' and 'title', indicating where
			// that layout interpolates the values. these other keys are streams or strings
			const res = getTemplate(path, opts.cache)(html, opts);
			// takes (html, blocks) where again blocks are the other keys exported above, returns stream or string
			const layout = getLayout(res.layout, opts.cache);
			cb(null, layout(html, { ...opts, ...res }));
		}
		catch (ex) {
			cb(ex);
		}
	});
	app.set('view engine', 'js');
};
