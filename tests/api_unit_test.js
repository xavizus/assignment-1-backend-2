const assert = require('chai').assert;
const should = require('chai').should();
const expect = require('chai').expect;
const sinon = require('sinon');
const todoListModel = require('../models/todolist').todoListModel;

describe('API', function () {
    describe('Successful tests', function() {
      it('Should return some todoItems', async function() {
          const fixedData = [{
              _id: 'FakeID',
              title: 'Fake Title',
              content: 'Fake Content',
              done: false,
              added: new Date(),
              updated: new Date(),
              belongsTo: 'FakeUser'
          }];
          let stub = sinon.stub(todoListModel, 'find').returns(fixedData)
          let result = await todoListModel.getTodoList()
          expect(result).to.eq(fixedData);
          stub.restore();
        });
    });
});