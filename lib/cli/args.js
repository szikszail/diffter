'use strict';

const { resolve } = require('path');
const requireIf = s => (typeof s === 'string') ? require(resolve(s)) : s;

module.exports = require('yargs')
    .config('config', 'Path to JS/JSON config file', requireIf)
    .options({
        base: {
            type: 's',
            require: true,
            description: 'Path of BASE results list JSON file.',
            coerce: requireIf
        },
        subject: {
            type: 's',
            require: true,
            description: 'Path of SUBJECT results list JSON file.',
            coerce: requireIf
        },
        title: {
            type: 's',
            description: 'Title of the report',
            default: 'Report'
        },
        save: {
            type: 's',
            require: true,
            description: 'Path of JSON file where DiffResults should be saved.',
            coerce: resolve
        },
        comparator: {
            type: 's',
            description: 'Path of JS file which exports custom Comparator function. Config could also contain actual Comparator function.',
            coerce: requireIf
        },
        filter: {
            type: 's',
            description: 'Path of JS file which exports custom Filter function. Config could also contain actual Filter function.',
            coerce: requireIf
        },
        modifier: {
            type: 's',
            description: 'Path of JS file which exports custom function to transform source data to display data. Config could also contain actual Transform function.',
            coerce: requireIf
        },
        js: {
            type: 'b',
            description: 'Should the result be save to JS file which exports DiffResults Object.',
            default: false
        }
    })
    .check(argv => {
        if (Array.isArray(argv.base)) {
            argv.base = {
                items: argv.base
            };
        } else if (!Array.isArray(argv.base.items)) {
            throw new Error('Base list must contain an Array (items)!');
        }
        if (Array.isArray(argv.subject)) {
            argv.subject = {
                items: argv.subject
            };
        } else if (!Array.isArray(argv.subject.items)) {
            throw new Error('Subject list must contain an Array (items)!');
        }
        return true;
    })
    .fail(function (msg, err, yargs) {
        if (msg) {
            console.error(msg);
            console.error('You should be doing', yargs.help());
            throw new Error(msg);
        }
        if (err) {
            console.error(err.message);
            console.error('You should be doing', yargs.help());
            throw err;
        }
    })
    .version(false)
    .parse(process.argv.slice(2));