const mongoose = require('mongoose');

class todoListModel {

    todoItem = mongoose.model('listItems', {
        title: String,
        content: String,
        done: Boolean,
        added: Date,
        updated: Date,
        belongsTo: String
    });

    async getTodoList(page = 0) {
        try {
            return await this.todoItem({},{}).skip(page*process.env.PAGINATION_COUNT).limit(process.env.PAGINATION_COUNT)
        } catch (error) {
            console.log(error);
            return false;
        }
    }
}


module.exports.todoListModel = new todoListModel()
