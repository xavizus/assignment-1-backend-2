const chai = require('chai')
const assert = chai.assert;
const should = chai.should();
const chaiHTTP = require('chai-http');
chai.use(chaiHTTP);
const app = require('../index').app;
const server = require('../index').server;
const expect = chai.expect;
const someTasks = require('./testTasksToAdd');

describe('API', function () {
    describe('Successful tests', function() {
        it('Should add shit ton of tasks',function () {

            for(let task of someTasks) {
                console.log(task);
                chai.request(app)
                    .post('/api/v1/addTodoItem')
                    .send(task)
                    .end((err, res) => {
                        expect(res).to.have.status(200);
                    });
            }
        });
    });
    server.close();
});