const mongoose = require('mongoose');
const {MissingKeysError} = require('../utilities/exceptionTypes');

class todoListModel {

    sort_asc = 1;
    sort_desc = -1;

    todoItemSchema = new mongoose.Schema({
        title:  { type: String, required: true },
        content: { type: String },
        done: { type: Boolean, default: false },
        userId: { type: String, required: true },
        isUrgent: {type: Boolean, default: false},
        todoListId: {type: String, required: true}
    }, {versionKey: false, timestamps: true, strict: "throw"});

    todoItemModel = mongoose.model('todoItems', this.todoItemSchema);


    /**
     * Add a todo item to the database
     * @param dataObject {
     *     title: String *,
     *     content: String,
     *     done: Boolean Defaults false,
     *     belongsTo: String or objectId
     * }
     * @returns {Promise<void>}
     */
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

    /**
     * Updates an todoItem
     * @param objectId
     * @param dataObject
     * @returns {Promise<*>}
     */
    async updateTodoItem(objectId, dataObject) {
        try {
            let result =  await this.todoItemModel.findOneAndUpdate({"_id": objectId}, {$set: dataObject}, {new: true, useFindAndModify: false});
            return result;
        } catch(error) {
            throw new Error(error.message);
        }
    }

    /**
     * Get amount of pages for pagination
     * @returns {Promise<number>}
     */
    async getCountPages() {
        try {
            let totalPages = await this.getTotalTodoItems();
            let notRounded = totalPages / process.env.PAGINATION_COUNT;
            let result = Math.ceil(notRounded);
            return result
        } catch(error) {
            throw new Error('Sum ting wong');
        }
    }

    /**
     * Get total todoItems
     * @returns {Promise<*>}
     */
    async getTotalTodoItems() {
        try {
            return await this.todoItemModel.countDocuments({});
        } catch(error) {
            throw new Error('Could not count db-request');
        }
    }

    /**
     * Get todoList by page.
     * @param page type Number
     * @param sortDir type String ('DESC' or 'ASC')
     * @param sortColumn type String
     * @returns {Promise<*>}
     */
    async getTodoList(dataObject) {
        try {
            let mongoDBSortDir = (dataObject.sortDir.toUpperCase() === 'DESC' ? this.sort_desc : this.sort_asc);
            let totalPages = await this.getCountPages();
            if (dataObject.page >= totalPages) {
                throw new Error('Not enough pages');
            }
            let sortObject = {};
            sortObject[dataObject.sortColumn] = mongoDBSortDir;
            return await this.todoItemModel.find(dataObject.query)
                .skip(dataObject.page*process.env.PAGINATION_COUNT)
                .limit(Number(process.env.PAGINATION_COUNT))
                .sort(sortObject);
        } catch (error) {
            throw new Error(error.message);
        }
    }

    /**
     * Removes a todoItem
     * @param objectId
     * @returns {Promise<{totalRemoved: (number|n|string)}>}
     */
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
