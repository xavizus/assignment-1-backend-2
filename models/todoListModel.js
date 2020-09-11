const mongoose = require('mongoose');

class todoListModel {
    todoListSchema = new mongoose.Schema({
        title:  { type: String, required: true },
        userId: { type: String, required: true },
    }, {versionKey: false, timestamps: true, strict: "throw"});

    todoListModel = mongoose.model('todoLists', this.todoListSchema);

    async addTodoList(dataObject) {
        try {
            let result = await this.todoListModel.create(dataObject)
            return {
                title: result.title,
                _id: result._id.toString()
            }
        } catch(error) {
            if(error.name === 'ValidationError') {
                throw new Error(error.message);
            }
            throw error;
        }
    }

    async getTodoLists(query) {
        try {
            return await this.todoListModel.find(query)
        } catch (error) {
            if(error.name === 'ValidationError') {
                throw new Error(error.message);
            }
            throw error;
        }
    }

    async deleteTodoList(query) {
        try {
            return await this.todoListModel.deleteOne(query)
        } catch (error) {
            if(error.name === 'ValidationError') {
                throw new Error(error.message);
            }
            throw error;
        }
    }

    async updateTodoList(todoListId, updateObject) {
        try {
            return await this.todoListModel.findOneAndUpdate({_id: todoListId}, {$set:updateObject}, {new: true, useFindAndModify: false})
        } catch (error) {
            if(error.name === 'ValidationError') {
                throw new Error(error.message);
            }
            throw error;
        }
    }

    async deleteAllUserTodoLists(userId) {
        try {
            let result = await this.todoListModel.deleteMany({userId});
            return {totalRemoved: result.n}
        } catch (error) {
            throw new Error(error.message);
        }
    }
}

module.exports = new todoListModel();