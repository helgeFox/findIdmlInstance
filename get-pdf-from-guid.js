'use strict';

const sql = require('mssql');
const path = require('path');

const environments = {
	STAGE: '\\\\fot-s-web01.prodno.osl.basefarm.net\\DATA2\\Salgsoppgave\\PDF\\',
	// PROD: '\\\\svfsfox01\\DATA1\\Salgsoppgave\\PDF\\' // PROD not yet tested. Also need other SQL connection
};
const config = {
    user: 'fot-fox',
    password: 'MrU$SycY',
    server: 'fot-s-mssql01.prodno.osl.basefarm.net',
    database: 'FoxPublish',
    pool: {
        max: 1,
        min: 0,
        idleTimeoutMillis: 30000
    }
};

function buildUri(set, options) {
	const baseUrl = environments.STAGE; // TODO: switch on environment to support PROD documents
	const folder = (set.ID + '').substr(0, 3) + (options.quality === 'hi' ? '000CMYK' : '000RGB');
	const file = set.Oppdrag_ID + '_' + set.ID + '.pdf';
	return path.join(baseUrl, folder, file);
}

function findInstance(guid, options) {
	// if (options.env && options.env !== 'STAGE')
	// 	config.server = environments[options.env];
	return new Promise((resolve, reject) => {
		new sql.ConnectionPool(config).connect().then(pool => {
		    return pool.request()
		    .input('input_parameter', sql.NVarChar, guid)
		    .query('select * from Salgsoppgave where GuidEditorId = @input_parameter')
		}).then(result => {
      		sql.close();
		    if (result.recordsets && result.recordsets.length > 0) {
		    	const pdfUri = buildUri(result.recordset[0], options);
					resolve(pdfUri);
		    }
		    else {
		    	sql.close();
		    	reject(new Error('Nothing found in database'))
		    }
		}).catch(err => {
			// console.log('Error', err);
			sql.close();
			reject(err);
		})

		sql.on('error', err => {
			// console.log('SQL error...', err)
			sql.close();
			reject(err);
		})
	})
}

exports = module.exports = findInstance;