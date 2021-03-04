'use strict';

const { readFileSync, writeFileSync, writeJsonSync } = require('fs-extra');
const { join, normalize, extname, relative } = require('path');
const { directory } = require('require-it').requireIt;
const ejs = require('ejs');
const uglifyJS = require('uglify-es');
const CleanCSS = require('clean-css');

const debug = require('./debug');

ejs.fileLoader = filePath => {
    debug('fileLoader %o', filePath);
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

const inPackage = (packageName, ...others) => {
    debug('inPackage(packageName: %o, others: %o)', packageName, others);
    const absPath = join(directory(packageName), ...others);
    return '/' + relative(join(__dirname, 'assets'), absPath).replace(/\\/g, '/');
};

const saveReport = (filePath, title, results) => {
    debug('saveReport(title: %o)', title);
    if (!filePath) {
        throw new Error('Path to report file must be set!');
    }
    if (extname(filePath) !== '.html') {
        filePath += '.html';
    }
    debug('saveReport -> filePath %o', filePath);
    debug('saveReport -> results %o', results);
    writeFileSync(filePath, ejs.render(
        readFileSync(normalize(join(__dirname, 'assets', 'index.html')), 'utf8'),
        { results, title, inPackage },
        {
            root: join(__dirname, 'assets'),
            reduce_vars: false
        }
    ));
};

const saveResults = (filePath, results, type = 'json', jsPrefix = 'module.exports = ') => {
    debug('saveResults(filePath: %o, type: %o, jsPrefix: %o)', filePath, type, jsPrefix);
    debug('saveResults -> results %o', results);
    if (String(type).toLowerCase() === 'js') {
        writeFileSync(filePath, `${jsPrefix}${JSON.stringify(results, null, 2)}`, 'utf8');
    } else {
        writeJsonSync(filePath, results, {
            spaces: 2,
            encoding: 'utf8'
        });
    }
};

module.exports = { saveReport, saveResults };