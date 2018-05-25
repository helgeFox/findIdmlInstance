'use strict';

const path = require('path');
const fs = require('fs-extra');

const environments = {
	stage: '\\\\fot-s-web01.prodno.osl.basefarm.net\\DATA2\\IDS\\INSTANCES\\',
	prod: '\\\\svfsfox01\\DATA1\\IDS\\INSTANCES\\'
};

exports = module.exports = function (guid, options) {
	return new Promise((resolve, reject) => {
		let env = options.env || 'STAGE';
		let folderPath = environments[env.toLowerCase()];
		let p = path.join(folderPath, guid);
		return fs.pathExists(p)
			.then((exists) => {
				if (exists) {
					const idmlUri = path.join(p, guid + '.idml');
					const expl = require('child_process').exec(`explorer.exe /select,${idmlUri}`); // TODO: this will not work on a Mac. Maybe we don't need it though, now that Helle also will be getting a PC.
					expl.stderr.on('data', (data) => {
						reject(new Error(data.toString()));
					});
					expl.on('exit', code => {
						resolve(idmlUri);
					});
				}
				else reject(`Path "${p}" does not exist`);
			});
	});
};