'use strict';

const {NOT_FOUND, IGNORED} = require('./const');

const prepareDiffList = items => {
    if (Array.isArray(items)) {
        items = {
            items
        };
    } else if (!Array.isArray(items.items)) {
        throw new Error('The given object must have an item property which is the list!');
    }
    return items;
};

/**
 * Determines the diff between the two list of items.
 * 
 * @param {SourceList|Array} baseList The base list of items.
 * @param {SourceList|Array} subjectList The subject list of items.
 * @param {DiffOptions} options The options to determine diff.
 * @returns {DiffResults} The results.
 */
const createDiff = (baseList, subjectList, options = {}) => {
    baseList = prepareDiffList(baseList);
    subjectList = prepareDiffList(subjectList);

    options = Object.assign({}, {
        comparator: require('deep-eql'),
        filter: () => true,
        transform: item => ({title: item})
    }, options);

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

    for (let baseIndex = 0;baseIndex < baseList.items.length; ++baseIndex) {
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