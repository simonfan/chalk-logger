/*
 * chalk-logger
 * https://github.com/simonfan/chalk-logger
 *
 * Copyright (c) 2013 
 * Licensed under the MIT license.
 */

/*
chalk reference

### chalk.stripColor(string)

Strip color from a string.


## Styles

### General

- reset
- bold
- italic
- underline
- inverse
- strikethrough

### Text colors

- black
- red
- green
- yellow
- blue
- magenta
- cyan
- white
- gray

### Background colors

- bgBlack
- bgRed
- bgGreen
- bgYellow
- bgBlue
- bgMagenta
- bgCyan
- bgWhite

*/

'use strict';

var chalk = require('chalk'),
	_ = require('lodash');

var chalkGeneral = ['reset','bold','italic','underline','inverse','strikethrough'],
	chalkColors = ['black','red','green','yellow','blue','magenta','cyan','white','gray'],
	chalkBg = ['bgBlack','bgRed','bgGreen','bgYellow','bgBlue','bgMagenta','bgCyan','bgWhite'];

var L = {
	error: ['red','bgYellow'],
}

_.each(chalkGeneral.concat(chalkColors).concat(chalkBg), function(style) {
	L[ style ] = [ style ];
});

function getChalkMethod(styles) {
	return styles.reduce(function(method, style) {
		return method[ style ];
	}, chalk);
}


exports.log = function log(loggerName, message, returnString) {

	var styles = L[ loggerName ],
		chalkMethod = getChalkMethod(styles);

	if (chalkMethod) {

		var str = chalkMethod(message);

		if (returnString) {
			return str;
		} else {
			console.log(str);
		}
	}

	return this;
};

exports.logger = function logger(loggerName, chalkStyles) {

	if (typeof loggerName === 'object') {

		_.each(loggerName, function(styles, name) {
			this.logger(name, styles);
		}.bind(this));

	} else {

		// save the styles under the logger name.
		L[loggerName] = chalkStyles;

		// define a quick method.
		exports[ loggerName ] = _.partial(exports.log, loggerName);
	}

	return this;
};

// initialize the L.
_.each(L, function(styles, logger) {
	exports.logger(logger, styles);
});