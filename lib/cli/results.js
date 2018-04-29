'use strict';

const {base, subject, comparator, filter, transform, js, save} = require('./args')();
const diff = require('../diff');
const {saveResults} = require('../save');

const results = diff(base, subject, {comparator, filter, transform});
saveResults(save, results, js ? 'js' : 'json', js);