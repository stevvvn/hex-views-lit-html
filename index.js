'use strict';
const { html } = require('@popeindustries/lit-html-server');
const directives = require('@popeindustries/lit-html-server/directives');

module.exports = {
	html,
	...directives
};
