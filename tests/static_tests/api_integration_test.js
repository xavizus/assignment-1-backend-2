require('dotenv').config();
const chai = require('chai');
const chaiHTTP = require('chai-http');
chai.use(chaiHTTP);
const app = require('../../index').app;
const server = require('../../index').server;
const expect = chai.expect;
const {users, taskLists, listOfTasks} = require('../testData');
let {mongoose} = require('../../database/mongodb');
const todoListModel = require('../../models/todoListModel');
const todoItemModel = require('../../models/todoItemModel');
const userModel = require('../../models/userModel');
const {randomNumber} = require('../../utilities/helperFunctions');

async function clearDatabase(){
    /**
     * Clear everything!
     */
    await userModel.userModel.deleteMany({});
    await todoListModel.todoListModel.deleteMany({});
    await todoItemModel.todoItemModel.deleteMany({});
}
describe('API',  function () {
    let testUsers = [];
    beforeEach(async() => {
        await clearDatabase();
        for(const user of users) {
            let testUser = await userModel.createUser(user, user.isAdmin);
            let randomNumberOfLists = randomNumber(1,4);
            testUser.todoLists = []
            for(let index = 0; index < randomNumberOfLists; index++) {
                let taskListResult = await todoListModel.addTodoList({
                    userId:testUser._id,
                    title: taskLists[randomNumber(0,taskLists.length-1)]
                });
                let randomNumberOfTasks = randomNumber(1,5);
                testUser.todoLists.push(taskListResult._id);

                for(let taskIndex = 0; taskIndex < randomNumberOfTasks; taskIndex++) {
                    await todoItemModel.addTodoItem(
                        {
                            title: listOfTasks[randomNumber(0, listOfTasks.length-1)],
                            userId: testUser._id,
                            todoListId: taskListResult._id
                        }
                    )
                }
            }
            testUser.token = await userModel.authenticateUser(user.username, user.password);
            testUsers.push(testUser);
        }
    });

    after(async () => {
        await clearDatabase();
        mongoose.connection.close();
    })

    describe('Successful tests', function() {
        it('Should authenticate users',async function () {
            for(let user of users) {
                await chai.request(app)
                    .post('/api/v1/auth')
                    .send({
                        username: user.username,
                        password: user.password
                    })
                    .then((response) => {
                        expect(response).to.have.status(200);
                    });
            }
        });

        it('Should get all of specific user todo lists', async function () {
           for(let user of testUsers) {
               if(user.roles.includes('admin')) {
                   continue;
               }
               await chai.request(app)
                   .get('/api/v1/todolists')
                   .set('Authorization', `Bearer ${user.token}`)
                   .send()
                   .then(response => {
                      expect(response).to.have.status(200);
                      expect(response.body).to.have.length(user.todoLists.length)
                   });
           }
        });
    });
    server.close();
});