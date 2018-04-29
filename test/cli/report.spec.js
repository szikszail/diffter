'use strict';

const proxyquire = require('proxyquire').noPreserveCache().noCallThru();
const sinon = require('sinon');
const { expect } = require('chai');

const mocks = {
    diff: sinon.stub().returns([]),
    save: {
        saveReport: sinon.spy()
    },
    args: () => ({
        base: 'base',
        subject: 'subject',
        comparator: 'comparator',
        filter: 'filter',
        transform: 'transform',
        save: 'save',
        title: 'title'
    })
};

describe('cli - report', () => {
    beforeEach(() => {
        proxyquire('../../lib/cli/report.js', {
            './args': mocks.args,
            '../diff': mocks.diff,
            '../save': mocks.save
        });
    })

    it('should call diff with proper arguments', () => {
        expect(mocks.diff.lastCall.args).to.eql([
            'base', 'subject', {
                comparator: 'comparator',
                filter: 'filter',
                transform: 'transform'
            }
        ]);
    });

    it('should call saveReport with proper arguments', () => {
        expect(mocks.save.saveReport.lastCall.args).to.eql([
            'save', 'title', []
        ]);
    });
});