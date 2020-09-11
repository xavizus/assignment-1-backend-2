const todoListModel = require('../models/todoListModel');
const httpStatusCodes = require('../utilities/http-statusCodes');
const baseController = require('./baseController');

class todoListController extends baseController {

    async createTodoList(req, res) {
        try {
            let todoListObject = {
                title: req.body.title,
                userId: req.user.userId
            }
            this.message = await todoListModel.addTodoList(todoListObject);
        } catch(error) {
            this.message = error.message;
            this.httpStatus = httpStatusCodes.BadRequest;
        }
        res.status(this.httpStatus).json(this.message);
    }

    async getTodoLists(req, res) {
        try {
            let userId = req.user.userId
            if(req.user.isAdmin) {
                userId = undefined;
            }
            this.message = await todoListModel.getTodoLists(userId);
        } catch(error) {
            this.message = error.message;
            this.httpStatus = httpStatusCodes.BadRequest;
        }
        res.status(this.httpStatus).json(this.message);
    }
}

module.exports = new todoListController();