'use strict';

const { NOT_FOUND, IGNORED } = require('./const');
const debug = require('./debug');

const prepareDiffList = items => {
    debug("prepareDiffList %o", items);
    if (Array.isArray(items)) {
        items = {
            items
        };
    } else if (!Array.isArray(items.items)) {
        throw new Error('The given object must have an item property which is the list!');
    }
    return items;
};

const createDiff = (baseList, subjectList, options = {}) => {
    debug('createDiff(options: %o)', options);
    baseList = prepareDiffList(baseList);
    debug('createDiff -> baseList %o', baseList);
    subjectList = prepareDiffList(subjectList);
    debug('createDiff -> subjectList %o', subjectList);

    if (typeof options.comparator !== 'function') {
        options.comparator = require('deep-eql');
    }
    if (typeof options.filter !== 'function') {
        options.filter = () => true;
    }
    if (typeof options.transform !== 'function') {
        options.transform = item => ({ title: item });
    }
    debug('createDiff -> options %o', options);

    const diff = {
        baseList: {
            title: baseList.title || 'Base',
            items: baseList.items.map(options.transform)
        },
        subjectList: {
            title: subjectList.title || 'Subject',
            items: subjectList.items.map(options.transform)
        },
        indexes: []
    };

    const subjectIndexes = subjectList.items.map((e, i) => i);

    for (let baseIndex = 0; baseIndex < baseList.items.length; ++baseIndex) {
        if (!options.filter(baseList.items[baseIndex])) {
            diff.indexes.push([baseIndex, IGNORED]);
        } else {
            let subjectIndex = 0;
            for (; subjectIndex < subjectList.items.length; ++subjectIndex) {
                const validIndex = subjectIndexes.indexOf(subjectIndex);
                if (options.comparator(baseList.items[baseIndex], subjectList.items[subjectIndex]) && validIndex > -1) {
                    diff.indexes.push([baseIndex, subjectIndex]);
                    subjectIndexes.splice(validIndex, 1);
                    break;
                }
            }
            if (subjectIndex === subjectList.items.length) {
                diff.indexes.push([baseIndex, NOT_FOUND]);
            }
        }
    }

    subjectIndexes.forEach(i => {
        diff.indexes.push([options.filter(subjectList.items[i]) ? NOT_FOUND : IGNORED, i]);
    });

    return diff;
};

module.exports = createDiff;