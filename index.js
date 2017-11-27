'use strict';

const path = require('path');
const fs = require('fs-extra');

const environments = {
	STAGE: '\\\\fot-s-web01.prodno.osl.basefarm.net\\DATA2\\IDS\\INSTANCES\\',
	PROD: '\\\\svfsfox01\\DATA1\\IDS\\INSTANCES\\'
};

exports = module.exports = function (guid, options) {
	return new Promise((resolve, reject) => {
		let env = options.env || 'STAGE';
		let folderPath = environments[env];
		let p = path.join(folderPath, guid);
		return fs.pathExists(p)
			.then((exists) => {
				if (exists) {
					require('child_process').exec('start "" "' + p + '"');
					resolve('YEY');
				}
				else reject(`Path "${p}" does not exist`);
			});
	});
};