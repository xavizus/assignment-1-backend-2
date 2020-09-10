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
}

module.exports = new todoListModel();