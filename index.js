'use strict';

/**
 * @function Comparator
 * @param {*} base The base item.
 * @param {*} subject The subject item.
 * @returns {boolean} Whether the two items are equal.
 */

/**
 * @function Filter
 * @param {*} item The item to check.
 * @returns {boolean} Whether the item should be kept.
 */

/**
 * @function Transform
 * @param {*} item The item to transform.
 * @returns {DiffListItem} The transformed item.
 */

/**
 * @typedef {Object} DiffOptions
 * @property {Comparator} comparator The comparator function, by default: deep-eql
 * @property {Filter} filter The filter funtion, by default: () => true
 * @property {Transform} transform The transform function, by default: item => item
 */

/**
 * @typedef {Array<Number>} DiffIndexes
 */

/**
 * @typedef {Object} DiffListItem
 * @property {string} title The display title of item.
 * @property {Object} metadata Any metadata of the given item.
 */

/**
 * @typedef {Object} DiffResults
 * @property {Array<DiffListItem>} baseList The base list of items.
 * @property {Array<DiffListItem>} subjectList The subject list of items.
 * @property {Array<DiffIndexes>} indexes The indexes list.
 */

module.exports.diff = require('./lib/diff');
module.exports.status = require('./lib/const');
module.exports.saveReport = require('./lib/save').saveReport;
module.exports.saveResults = require('./lib/save').saveResults;