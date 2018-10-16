'use strict';

const path = require('path');
const fs = require('fs-extra');

const environments = {
	stage: '\\\\fot-s-web01.prodno.osl.basefarm.net\\DATA2\\IDS\\INSTANCES\\',
	prod: '\\\\svfsfox01\\DATA1\\IDS\\INSTANCES\\'
};

exports = module.exports = function (guid, options) {
	let env = options.env || 'STAGE';
	options.basePath = environments[env.toLowerCase()];
	return checkVpn(options.basePath).then(findInstance.bind(null, guid, options));
};

function checkVpn(path) {
	return new Promise((resolve, reject) => {
		fs.pathExists(path)
			.then((exists) => {
				if (exists) {
					resolve(true);
				}
				else {
					reject(new Error(`Base path ${path} was not found. Wrong VPN maybe?`));
				}
			}).catch((err) => reject('err0rz:' + err));
	});
}

function findInstance(guid, options) {
	return new Promise((resolve, reject) => {
		let p = path.join(options.basePath, guid);
		return fs.pathExists(p)
			.then((exists) => {
				if (exists) {
					const idmlUri = path.join(p, guid + '.idml');
					resolve(idmlUri);
				}
				else reject(`Path "${p}" does not exist`);
			});
	});
}