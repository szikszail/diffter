'use strict';

const ARGS_PATH = require.resolve('../../lib/cli/args.js');
const { expect } = require('chai');
const sinon = require('sinon');
const { resolve } = require('path');

describe('Arguments', () => {
    let prevArgs;

    beforeEach(() => {
        prevArgs = process.argv.slice();
    });

    afterEach(() => {
        delete require.cache[ARGS_PATH];
        process.argv = prevArgs;
    });

    const getArgs = function (...args) {
        process.argv = ['node', 'test', ...args];
        return require(ARGS_PATH);
    };

    it('should fail if no base argument passed', () => {
        expect(() => getArgs()).to.throw(/base/);
    });

    it('should fail if no subject argument passed', () => {
        expect(() => getArgs()).to.throw(/subject/);
    });

    it('should fail if no save argument passed', () => {
        expect(() => getArgs()).to.throw(/save/);
    });

    it('should fail if base is not a list', () => {
        expect(() => getArgs(
            '--base', 'test/data/wrong.json',
            '--subject', 'test/data/subject.json',
            '--save', 'test/data'
        )).to.throw(/Base list/);
    });

    it('should fail if subject is not a list', () => {
        expect(() => getArgs(
            '--base', 'test/data/base.json',
            '--subject', 'test/data/wrong.json',
            '--save', 'test/data'
        )).to.throw(/Subject list/);
    });

    it('should parse source arguments', () => {
        const args = getArgs(
            '--base', 'test/data/base.json',
            '--subject', 'test/data/subject.json',
            '--save', 'test/data'
        );

        expect(args.base).to.eql(require('../data/base.json'));
        expect(args.subject).to.eql(require('../data/subject.json'));
        expect(args.save).to.equal(resolve('test/data'));
    });

    it('should have default arguments', () => {
        const args = getArgs(
            '--base', 'test/data/base.json',
            '--subject', 'test/data/subject.json',
            '--save', 'test/data'
        );

        expect(args.js).to.be.false;
        expect(args.title).to.equal('Report');
        expect(args.comparator).to.be.undefined;
        expect(args.filter).to.be.undefined;
        expect(args.modifier).to.be.undefined;
    });

    it('should parse other arguments', () => {
        const args = getArgs(
            '--base', 'test/data/base.json',
            '--subject', 'test/data/subject.json',
            '--save', 'test/data',
            '--title', 'Title',
            '--js', 'module.exports = '
        );

        expect(args.js).to.equal('module.exports = ');
        expect(args.title).to.equal('Title');
    });

    it('should parse function arguments', () => {
        const args = getArgs(
            '--base', 'test/data/base.json',
            '--subject', 'test/data/subject.json',
            '--save', 'test/data',
            '--comparator', 'test/data/function.js',
            '--modifier', 'test/data/function.js',
            '--filter', 'test/data/function.js'
        );

        expect(args.comparator).to.be.a('function');
        expect(args.filter).to.be.a('function');
        expect(args.modifier).to.be.a('function');
    });
});