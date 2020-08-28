const chai = require('chai')
const chaiHTTP = require('chai-http');
chai.use(chaiHTTP);
const app = require('../index').app;
const server = require('../index').server;
const expect = chai.expect;
const someTasks = require('./testTasksToAdd.js');

describe('API', function () {
    describe('Successful tests', function() {
        it('Should add shit ton of tasks',async function () {
            let cleanUpIds = [];
            for(let task of someTasks) {
                await chai.request(app)
                    .post('/api/v1/todoItems')
                    .send(task)
                    .then((res) => {
                        expect(res).to.have.status(200);
                        cleanUpIds.push(res.body._id);
                    });
            }

            //clean up
            for(let id in cleanUpIds) {
                chai.request(app)
                    .delete(`/api/v1/todoItems/${id}`)
                    .send()
                    .then(( res) => {
                        expect(res).to.have.status(200);
                    });
            }
        });
    });
    server.close();
});