const mongoose = require('mongoose');
const {MissingKeysError} = require('../utilities/exceptionTypes');

class todoListModel {

    sort_asc = 1;
    sort_desc = -1;

    todoItemSchema = new mongoose.Schema({
        title:  { type: String, required: true },
        content: { type: String },
        done: { type: Boolean, default: false },
        belongsTo: { type: String }
    }, {versionKey: false, timestamps: true, strict: "throw"});

    todoItemModel = mongoose.model('todoItem', this.todoItemSchema);

    async addTodoItem(dataObject) {
        try {
            return await this.todoItemModel.create(dataObject);
        } catch(error) {
            if(error.name === 'ValidationError') {
                throw new Error(error.message);
            }
            throw error;
        }
    }

    async updateTodoItem(objectId, dataObject) {
        try {
            let result =  await this.todoItemModel.findOneAndUpdate({"_id": objectId}, {$set: dataObject}, {new: true, useFindAndModify: false});
            return result;
        } catch(error) {
            throw new Error(error.message);
        }
    }

    async getCountPages() {
        try {
            let totalPages = await this.getCountTodoList();
            let notRounded = totalPages / process.env.PAGINATION_COUNT;
            let result = Math.ceil(notRounded);
            return result
        } catch(error) {
            throw new Error('Sum ting wong');
        }
    }

    async getCountTodoList() {
        try {
            return await this.todoItemModel.countDocuments({});
        } catch(error) {
            throw new Error('Could not count db-request');
        }
    }

    async getTodoList(page, sortDir='DESC', sortColumn='createdAt') {
        try {
            let mongoDBSortDir = (sortDir.toUpperCase() === 'DESC' ? this.sort_desc : this.sort_asc);
            let totalPages = await this.getCountPages()
            if (page >= totalPages) {
                throw new Error('Not enough pages');
            }
            let sortObject = {};
            sortObject[sortColumn] = mongoDBSortDir
            return await this.todoItemModel.find()
                .skip(page*process.env.PAGINATION_COUNT)
                .limit(Number(process.env.PAGINATION_COUNT))
                .sort(sortObject);
        } catch (error) {
            throw new Error(error.message);
        }
    }

    async deleteTodoItem(objectId) {
        try {
            let result =  await this.todoItemModel.deleteOne({_id: objectId})
            return {totalRemoved: result.n};
        } catch(error) {
            throw new Error(error.message);
        }
    }
}

module.exports = new todoListModel()
