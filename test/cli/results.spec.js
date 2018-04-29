'use strict';

const proxyquire = require('proxyquire').noPreserveCache().noCallThru();
const sinon = require('sinon');
const { expect } = require('chai');

const mocks = {
    diff: sinon.stub().returns([]),
    save: {
        saveResults: sinon.spy()
    },
    args: {
        base: 'base',
        subject: 'subject',
        comparator: 'comparator',
        filter: 'filter',
        transform: 'transform',
        save: 'save',
        js: false
    }
};

describe('cli - results', () => {
    beforeEach(() => {
        proxyquire('../../lib/cli/results.js', {
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
        expect(mocks.save.saveResults.lastCall.args).to.eql([
            'save', [], 'json', false
        ]);
    });
});