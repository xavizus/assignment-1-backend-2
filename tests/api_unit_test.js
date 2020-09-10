require('dotenv').config();
const chai = require('chai');
const expect = chai.expect;
chai.use(require('chai-as-promised'));
require('../database/mongodb');
const todoListModel = require('../models/todoListModel');
const todoItemModel = require('../models/todoItemModel');
const userModel = require('../models/userModel');
const {MissingKeysError} = require('../utilities/exceptionTypes');
const {users, taskLists} = require('./testData');

describe('API', function () {

    let testUsers = [];
    let taskIdToDelete;
    let taskIdToEdit;

    beforeEach(async () => {
        /**
         * Clear everything!
         */
        await userModel.userModel.deleteMany({});
        await todoListModel.todoListModel.deleteMany({});
        await todoItemModel.todoItemModel.deleteMany({});
        /**
         * Create test users
         */
        for (const user of users) {
            testUsers.push(await userModel.createUser(user, user.isAdmin));
        }

    });

    describe('User model tests', function () {
        describe('Successful tests', function () {
            it('Should be able to add a user', async function () {
                let result = await userModel.createUser(testUser);
                expect(result._id).to.have.length(24);
                expect(result.roles).to.have.length(1);
                expect(result.roles[0]).to.eql('user');
            });

            it('Should be able to authenticate a user', async function () {
               for(const user of users) {
                    await expect(userModel.authenticateUser(user.username, user.password))
                        .to.eventually.be.an("String");
               }
            });
        });
        describe('Unsuccessful tests', function () {
            it('Should throw if missing username', async function () {
                const testUser = {
                    "password": "1234",
                    "firstName": "test",
                    "surname": "user"
                }
                expect(userModel.createUser(testUser)).to.eventually
                    .be.rejectedWith('Missing the key username!')
                    .and.be.an.instanceOf(Error);
            });
            it('Should throw if data in the username key', async function () {
                const testUser = {
                    "username": undefined,
                    "password": "1234",
                    "firstName": "test",
                    "surname": "user"
                }
                expect(userModel.createUser(testUser)).to.eventually
                    .be.rejectedWith('Missing the key username!')
                    .and.be.an.instanceOf(Error);
            });
            it('Should throw if missing password key', async function () {
                const testUser = {
                    "username": "testUser",
                    "firstName": "test",
                    "surname": "user"
                }
                expect(userModel.createUser(testUser)).to.eventually
                    .be.rejectedWith('Missing the key password!')
                    .and.be.an.instanceOf(Error);
            });
            it('Should throw if missing password data', async function () {
                const testUser = {
                    "username": "testUser",
                    "password": undefined,
                    "firstName": "test",
                    "surname": "user"
                }
                expect(userModel.createUser(testUser)).to.eventually
                    .be.rejectedWith('Missing the key password!')
                    .and.be.an.instanceOf(Error);
            });
        });
    });

    describe('TodoList Model tests', function () {
        describe('Successful tests', function () {
            it('Should create a todoList', async function() {
                for(const user of testUsers) {
                    let testList = {
                        title: taskLists[Math.floor(Math.random() * taskLists.length)+ 1],
                        userId: user._id,
                    }
                    let result = await todoListModel.addTodoList(testList)
                    expect(result._id).to.have.length(24)
                }
            });
        });
        describe('Unsuccessful tests', function () {

        });
    });

    describe('todoItem Model tests', function () {
        describe('Successful tests', function () {

        });
        describe('Unsuccessful tests', function () {

        });
    });
});