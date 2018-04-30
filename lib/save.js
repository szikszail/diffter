'use strict';

const { readFileSync, writeFileSync, writeJsonSync } = require('fs-extra');
const { join, normalize, extname } = require('path');
const ejs = require('ejs');
const uglifyJS = require('uglify-es');
const CleanCSS = require('clean-css');

ejs.fileLoader = filePath => {
    const content = readFileSync(filePath, 'utf8');
    switch (extname(filePath)) {
        case '.js':
            const minifiedJS = uglifyJS.minify(content);
            if (minifiedJS.error) {
                throw minifiedJS.error;
            }
            return '<script>' + minifiedJS.code + '</script>';
        case '.css':
            const minifiedCSS = new CleanCSS().minify(content);
            if (minifiedCSS.errors && minifiedCSS.errors.length) {
                throw minifiedCSS.errors[0];
            }
            return '<style>' + minifiedCSS.styles + '</style>';
        default:
            return content;
    }
};

/**
 * Saves the given diff results report to the given folder.
 * 
 * @param {string} filePath The path to the file, where report should be stored.
 * @param {string} title The title of the report.
 * @param {DiffResults} results The results needs to be stored.
 */
const saveReport = (filePath, title, results) => {
    if (!filePath) {
        throw new Error('Path to report file must be set!');
    }
    if (extname(filePath) !== '.html') {
        filePath += '.html';
    }
    writeFileSync(filePath, ejs.render(
        readFileSync(normalize(join(__dirname, 'assets', 'index.html')), 'utf8'),
        { results, title },
        {
            root: join(__dirname, 'assets'),
            reduce_vars: false
        }
    ));
};
module.exports.saveReport = saveReport;

/**
 * Saves the given diff results to the given file (JSON or JS).
 * 
 * @param {string} filePath The path to the file, where results should be stored.
 * @param {DiffResults} results The results needs to be stored.
 * @param {string} type The file type to store results, js or json, default: json.
 * @param {string} jsPrefix The prefix which needs to be used to store results in case of JS.
 */
const saveResults = (filePath, results, type = 'json', jsPrefix = 'module.exports = ') => {
    if (String(type).toLowerCase() === 'js') {
        writeFileSync(filePath, `${jsPrefix}${JSON.stringify(results, null, 2)}`, 'utf8');
    } else {
        writeJsonSync(filePath, results, {
            spaces: 2,
            encoding: 'utf8'
        });
    }
};
module.exports.saveResults = saveResults;