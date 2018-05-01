'use strict';

const sinon = require('sinon');
const { expect } = require('chai');
const proxyquire = require('proxyquire');

const mocks = {
    fs: {
        writeFileSync: sinon.spy(),
        writeJsonSync: sinon.spy(),
        readFileSync: sinon.stub().returns('content')
    },
    ejs: {
        fileLoader: undefined,
        render: sinon.spy()
    },
    uglify: {
        minify(code) {
            if (mocks.uglify._result instanceof Error) {
                return {
                    error: mocks.uglify._result
                };
            }
            return {
                code: mocks.uglify._result || code
            };
        }
    },
    cleanCss: class CleanCss {
        minify(css) {
            if (mocks.cleanCss._result instanceof Error) {
                return {
                    errors: [mocks.cleanCss._result]
                };
            }
            return {
                styles: mocks.cleanCss._result || css
            };
        }
    }
};

describe('save', () => {
    let save;

    beforeEach(() => {
        save = proxyquire('../lib/save', {
            'fs-extra': mocks.fs,
            'ejs': mocks.ejs,
            'uglify-es': mocks.uglify,
            'clean-css': mocks.cleanCss
        });
    });

    describe('.saveResults', () => {
        it('should save to JS file', () => {
            save.saveResults('file', [], 'js', 'prefix');
            expect(mocks.fs.writeFileSync.getCall(0).args).to.eql([
                'file', 'prefix[]', 'utf8'
            ]);
        });

        it('should save to JSON file', () => {
            save.saveResults('file', [], 'json');
            expect(mocks.fs.writeJsonSync.getCall(0).args).to.eql([
                'file', [], {
                    encoding: 'utf8',
                    spaces: 2
                }
            ]);
        });
    });

    describe('.saveReport', () => {
        it('should create HTML file with rendered EJS', () => {
            save.saveReport('test.html', 'Title', []);

            expect(mocks.fs.writeFileSync.lastCall.args[0]).to.equal('test.html');
            expect(mocks.fs.readFileSync.lastCall.args[0]).to.match(/assets.index\.html/);
            expect(mocks.ejs.render.lastCall.args[0]).to.equal('content');
            expect(mocks.ejs.render.lastCall.args[1]).to.deep.include({
                results: [],
                title: 'Title'
            });
            expect(mocks.ejs.render.lastCall.args[2].root).to.match(/assets/);
        });

        it('should handle if not full file name has been provided', () => {
            save.saveReport('test', 'Title', []);

            expect(mocks.fs.writeFileSync.lastCall.args[0]).to.equal('test.html');
            expect(mocks.fs.readFileSync.lastCall.args[0]).to.match(/assets.index\.html/);
            expect(mocks.ejs.render.lastCall.args[0]).to.equal('content');
            expect(mocks.ejs.render.lastCall.args[1]).to.deep.include({
                results: [],
                title: 'Title'
            });
            expect(mocks.ejs.render.lastCall.args[2].root).to.match(/assets/);
        });
    });

    describe('EJS', () => {
        it('should define custom fileLoader', () => {
            expect(mocks.ejs.fileLoader).not.to.be.undefined;
        });

        it('should return JS script tag in case of JS files', () => {
            const markup = mocks.ejs.fileLoader('smth.js');
            expect(mocks.fs.readFileSync.lastCall.args[0]).to.eql('smth.js');
            expect(markup).to.equal('<script>content</script>');
        });

        it('should throw error if JS file contains error', () => {
            mocks.uglify._result = new Error('SyntaxError');
            expect(() => mocks.ejs.fileLoader('smth.js')).to.throw('SyntaxError');
        });

        it('should return CSS style tag in case of CSS files', () => {
            const markup = mocks.ejs.fileLoader('smth.css');
            expect(mocks.fs.readFileSync.lastCall.args[0]).to.eql('smth.css');
            expect(markup).to.equal('<style>content</style>');
        });

        it('should throw error if CSS file contains error', () => {
            mocks.cleanCss._result = new Error('SyntaxError');
            expect(() => mocks.ejs.fileLoader('smth.css')).to.throw('SyntaxError');
        });

        it('should return original content of other files', () => {
            const markup = mocks.ejs.fileLoader('smth.html');
            expect(mocks.fs.readFileSync.lastCall.args[0]).to.eql('smth.html');
            expect(markup).to.equal('content');
        });
    });
});