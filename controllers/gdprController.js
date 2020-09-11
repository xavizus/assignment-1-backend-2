const baseController = require('./baseController');
const userModel = require('../models/userModel');
const todoListModel = require('../models/todoListModel');
const todoItemModel = require('../models/todoItemModel');
const httpStatusCodes = require('../utilities/http-statusCodes');

class gdprController extends baseController {
    constructor() {
        super();
    }

    async clearUserInformation(req, res){
        try {
            let deletedItems = await todoItemModel.deleteAllUserTodoItems(req.user.userId);
            let deletedTodoLists = await todoListModel.deleteAllUserTodoLists(req.user.userId);
            let deleteUser = await userModel.deleteUser(req.user.userId);
            this.message = {
                deletedItems,
                deletedTodoLists,
                deleteUser
            }
        } catch(error) {
            this.message = error.message;
            this.httpStatus = httpStatusCodes.BadRequest;
        }
        res.status(this.httpStatus).json(this.message);
    }
}

module.exports = new gdprController();