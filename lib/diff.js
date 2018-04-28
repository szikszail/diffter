'use strict';

const {NOT_FOUND, IGNORED} = require('./const');

/**
 * Determines the diff between the two list of items.
 * 
 * @param {Array} baseList The base list of items.
 * @param {Array} subjectList The subject list of items.
 * @param {DiffOptions} options The options to determine diff.
 * @returns {DiffResults} The results.
 */
const createDiff = (baseList, subjectList, options = {}) => {
    options = Object.assign({}, {
        comparator: require('deep-eql'),
        filter: () => true,
        transform: item => ({title: item})
    }, options);

    const diff = {
        baseList: baseList.map(options.transform),
        subjectList: subjectList.map(options.transform),
        indexes: []
    };

    const subjectIndexes = subjectList.map((e, i) => i);

    for (let baseIndex = 0;baseIndex < baseList.length; ++baseIndex) {
        if (!options.filter(baseList[baseIndex])) {
            diff.indexes.push([baseIndex, IGNORED]);
        } else {
            let subjectIndex = 0;
            for (; subjectIndex < subjectList.length; ++subjectIndex) {
                const validIndex = subjectIndexes.indexOf(subjectIndex);
                if (options.comparator(baseList[baseIndex], subjectList[subjectIndex]) && validIndex > -1) {
                    diff.indexes.push([baseIndex, subjectIndex]);
                    subjectIndexes.splice(validIndex, 1);
                    break;
                }
            }
            if (subjectIndex === subjectList.length) {
                diff.indexes.push([baseIndex, NOT_FOUND]);
            }
        }
    }

    subjectIndexes.forEach(i => {
        diff.indexes.push([options.filter(subjectList[i]) ? NOT_FOUND : IGNORED, i]);
    });

    return diff;
};

module.exports = createDiff;