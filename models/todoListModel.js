const mongoose = require('mongoose');

class todoListModel {
    todoListSchema = new mongoose.Schema({
        title:  { type: String, required: true },
        ownerId: { type: String, required: true },
    }, {versionKey: false, timestamps: true, strict: "throw"});

    todoListSchema = mongoose.model('todoLists', this.todoListSchema);

    async addTodoList(dataObject) {
        try {
            return await this.todoItemModel.create(dataObject);
        } catch(error) {
            if(error.name === 'ValidationError') {
                throw new Error(error.message);
            }
            throw error;
        }
    }
}


module.exports = new todoListModel();