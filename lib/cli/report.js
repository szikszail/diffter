'use strict';

const {base, subject, comparator, filter, transform, save, title} = require('./args')();
const diff = require('../diff');
const {saveReport} = require('../save');

const results = diff(base, subject, {comparator, filter, transform});
saveReport(save, title, results);