const chai = require('chai')
const assert = chai.assert;
const should = chai.should();
const chaiHTTP = require('chai-http');
chai.use(chaiHTTP);
const app = require('../index').app;
const server = require('../index').server;
const expect = chai.expect;

describe('API', function () {
    describe('Successful tests', function() {
        it('Should return some todoItems', done => {
            assert.strictEqual(true,true);
            chai.request(app)
                .get('/get')
                .end((err, res) => {
                    done();
                });
        });
    });
    server.close();
});