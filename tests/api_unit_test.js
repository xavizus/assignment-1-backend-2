const chai = require('chai');
const expect = chai.expect;
chai.use(require('chai-as-promised'));
const sinon = require('sinon');
require('../database/mongodb');
const todoListModel = require('../models/todoItemModel').todoListModel;
const {MissingKeysError} = require('../utilities/exceptionTypes');

describe('API', function () {
    describe('Successful tests', function () {
        it('Should return some todoItems', async function () {
            const fixedData = [
                {
                    _id: 'FakeID',
                    title: 'Fake Title',
                    content: 'Fake Content',
                    done: false,
                    added: new Date(),
                    updated: new Date(),
                    belongsTo: 'FakeUser'
                },
                {
                    _id: 'FakeID 2',
                    title: 'Fake Title 2',
                    content: 'Fake Content 2',
                    done: true,
                    added: new Date(),
                    updated: new Date(),
                    belongsTo: 'FakeUser 2'
                }
            ];
            let stub = sinon.stub(todoListModel, 'getTodoList').returns(fixedData)
            let result = await todoListModel.getTodoList();
            expect(result).to.eq(fixedData);
            stub.restore();
        });
        it('Should do somehting', async function() {
            const fixedObject = {
                'title': "Sum title",
                'content': "Sum content",
                'done': false,
                'belongsTo': undefined
            };
            let result = await todoListModel.addTodoItem(fixedObject);
            expect(result).to.be.true;
        });
    });
    describe('Thrown tests', function () {
       it('Should throw some error', async function () {
           let stub = sinon.stub(todoListModel, 'getTodoList').throws(new Error('Could not getTodoList'));
           expect(() => todoListModel.getTodoList()).to.throw('Could not getTodoList');
       });
        it('Should throw missing required keys', async function() {
            const fixedObject = {
                'title': "Sum title",
                'content': "Sum content",
                'done': false
            };
            await expect(todoListModel.addTodoItem(fixedObject)).to.be.rejectedWith(MissingKeysError);
        });
    });
});