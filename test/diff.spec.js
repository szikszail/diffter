'use strict';

const diff = require('../lib/diff');
const { NOT_FOUND, IGNORED } = require('../lib/const');
const { expect } = require('chai');
const eql = require('deep-eql');

const asTitle = title => ({ title });

describe('Diff', () => {
    it('should work with empty lists', () => {
        expect(diff([], [])).to.eql({
            baseList: {
                title: 'Base',
                items: []
            },
            subjectList: {
                title: 'Subject',
                items: []
            },
            indexes: []
        });
    });

    it('should handle proper data type', () => {
        const baseList = { title: 'Base List', items: [1, 2, 3] };
        const subjectList = { title: 'Subject List', items: [1, 2, 3] };
        expect(diff(baseList, subjectList)).to.eql({
            baseList: {
                title: 'Base List',
                items: baseList.items.map(asTitle)
            },
            subjectList: {
                title: 'Subject List',
                items: subjectList.items.map(asTitle)
            },
            indexes: [
                [0, 0],
                [1, 1],
                [2, 2]
            ]
        });
    })

    it('should identify identical lists', () => {
        const baseList = [1, 2, 3];
        const subjectList = [1, 2, 3];
        expect(diff(baseList, subjectList)).to.eql({
            baseList: {
                title: 'Base',
                items: baseList.map(asTitle)
            },
            subjectList: {
                title: 'Subject',
                items: subjectList.map(asTitle)
            },
            indexes: [
                [0, 0],
                [1, 1],
                [2, 2]
            ]
        });
    });

    it('should identify new elements', () => {
        const baseList = [1, 2, 3];
        const subjectList = [1, 2, 3, 4];
        expect(diff(baseList, subjectList)).to.eql({
            baseList: {
                title: 'Base',
                items: baseList.map(asTitle)
            },
            subjectList: {
                title: 'Subject',
                items: subjectList.map(asTitle)
            },
            indexes: [
                [0, 0],
                [1, 1],
                [2, 2],
                [NOT_FOUND, 3]
            ]
        });
    });

    it('should identify deleted elements', () => {
        const baseList = [1, 2, 3, 4];
        const subjectList = [1, 3, 4];
        expect(diff(baseList, subjectList)).to.eql({
            baseList: {
                title: 'Base',
                items: baseList.map(asTitle)
            },
            subjectList: {
                title: 'Subject',
                items: subjectList.map(asTitle)
            },
            indexes: [
                [0, 0],
                [1, NOT_FOUND],
                [2, 1],
                [3, 2]
            ]
        });
    });

    it('should identify elements in wrong order', () => {
        const baseList = [1, 4, 3, 2];
        const subjectList = [1, 3, 2, 4];
        expect(diff(baseList, subjectList)).to.eql({
            baseList: {
                title: 'Base',
                items: baseList.map(asTitle)
            },
            subjectList: {
                title: 'Subject',
                items: subjectList.map(asTitle)
            },
            indexes: [
                [0, 0],
                [1, 3],
                [2, 1],
                [3, 2]
            ]
        });
    });

    it('should work with objects too', () => {
        const baseList = [
            { a: 1 },
            { a: 4 },
            { b: 1 },
            { a: 3 },
            { a: 2 }
        ];
        const subjectList = [
            { a: 1 },
            { a: 3 },
            { c: 1 },
            { a: 2 },
            { a: 4 }
        ];
        expect(diff(baseList, subjectList)).to.eql({
            baseList: {
                title: 'Base',
                items: baseList.map(asTitle)
            },
            subjectList: {
                title: 'Subject',
                items: subjectList.map(asTitle)
            },
            indexes: [
                [0, 0],
                [1, 4],
                [2, NOT_FOUND],
                [3, 1],
                [4, 3],
                [NOT_FOUND, 2]
            ]
        });
    });

    it('should identify duplicate in base as deleted', () => {
        const baseList = [1, 2, 2, 3];
        const subjectList = [1, 2, 3];
        expect(diff(baseList, subjectList)).to.eql({
            baseList: {
                title: 'Base',
                items: baseList.map(asTitle)
            },
            subjectList: {
                title: 'Subject',
                items: subjectList.map(asTitle)
            },
            indexes: [
                [0, 0],
                [1, 1],
                [2, NOT_FOUND],
                [3, 2]
            ]
        });
    });

    it('should identify duplicate in subject as new', () => {
        const baseList = [1, 2, 3];
        const subjectList = [1, 2, 2, 3];
        expect(diff(baseList, subjectList)).to.eql({
            baseList: {
                title: 'Base',
                items: baseList.map(asTitle)
            },
            subjectList: {
                title: 'Subject',
                items: subjectList.map(asTitle)
            },
            indexes: [
                [0, 0],
                [1, 1],
                [2, 3],
                [NOT_FOUND, 2]
            ]
        });
    });

    it('should handle custom comparator function', () => {
        const baseList = [
            { a: 1 },
            { a: 4 },
            { a: 3 },
            { b: 1 },
            { a: 2 }
        ];
        const subjectList = [
            { a: 1 },
            { c: 1 },
            { a: 3 },
            { a: 2 },
            { a: 4 }
        ];
        const comparator = (o1, o2) => (o1.a || o2.a) ? o1.a === o2.a : eql(o1, o2);
        expect(diff(baseList, subjectList, {
            comparator
        })).to.eql({
            baseList: {
                title: 'Base',
                items: baseList.map(asTitle)
            },
            subjectList: {
                title: 'Subject',
                items: subjectList.map(asTitle)
            },
            indexes: [
                [0, 0],
                [1, 4],
                [2, 2],
                [3, NOT_FOUND],
                [4, 3],
                [NOT_FOUND, 1]
            ]
        });
    });

    it('should handle custom filter function', () => {
        const baseList = [
            { a: 1 },
            { a: 4 },
            { a: 3 },
            { b: 1 },
            { a: 2 }
        ];
        const subjectList = [
            { a: 1 },
            { c: 1 },
            { a: 3 },
            { a: 2 },
            { a: 4 }
        ];
        const filter = e => e.a;
        expect(diff(baseList, subjectList, {
            filter
        })).to.eql({
            baseList: {
                title: 'Base',
                items: baseList.map(asTitle)
            },
            subjectList: {
                title: 'Subject',
                items: subjectList.map(asTitle)
            },
            indexes: [
                [0, 0],
                [1, 4],
                [2, 2],
                [3, IGNORED],
                [4, 3],
                [IGNORED, 1]
            ]
        });
    });

    it('should handle custom transform function', () => {
        const baseList = [
            { a: 1 },
            { a: 4 },
            { a: 3 },
            { b: 1 },
            { a: 2 }
        ];
        const subjectList = [
            { a: 1 },
            { c: 1 },
            { a: 3 },
            { a: 2 },
            { a: 4 }
        ];
        const transform = e => JSON.stringify(e);
        expect(diff(
            baseList,
            subjectList,
            {
                transform
            }
        )).to.eql({
            baseList: {
                title: 'Base',
                items: baseList.map(transform)
            },
            subjectList: {
                title: 'Subject',
                items: subjectList.map(transform)
            },
            indexes: [
                [0, 0],
                [1, 4],
                [2, 2],
                [3, NOT_FOUND],
                [4, 3],
                [NOT_FOUND, 1]
            ]
        });
    });
});