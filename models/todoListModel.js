const mongoose = require('mongoose');

class todoListModel {
    todoListSchema = new mongoose.Schema({
        title:  { type: String, required: true },
        ownerId: { type: String, required: true },
    }, {versionKey: false, timestamps: true, strict: "throw"});

    todoListSchema = mongoose.model('todoItem', this.todoListSchema);
}


module.exports = new todoListModel();