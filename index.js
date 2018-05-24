'use strict';

const getPdf = require('./get-pdf-from-guid');
const getIdml = require('./get-idml-from-guid');

exports = module.exports = {
	getPdfFromGuid: getPdf,
	getIdmlFromGuid: getIdml
};