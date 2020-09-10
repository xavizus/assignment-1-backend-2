const mongoose = require('mongoose');

class todoListModel {
    todoListSchema = new mongoose.Schema({
        title:  { type: String, required: true },
        userId: { type: String, required: true },
    }, {versionKey: false, timestamps: true, strict: "throw"});

    todoListModel = mongoose.model('todoLists', this.todoListSchema);

    async addTodoList(dataObject) {
        try {
            return await this.todoListModel.create(dataObject);
        } catch(error) {
            if(error.name === 'ValidationError') {
                throw new Error(error.message);
            }
            throw error;
        }
    }
}


module.exports = new todoListModel();