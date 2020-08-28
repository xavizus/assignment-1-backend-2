const todoListModel = require('../models/todolist');
const baseController = require('./baseController');
const httpStatusCodes = require('../utilities/http-statusCodes');

class todoListController extends baseController {

    constructor() {
        super();
    }

    async getAllTodoItems(req, res) {
        const defaultPageIndex = 0;
        if(!req.params.page) req.params.page = defaultPageIndex;
        try {
            let result = await todoListModel.getTodoList(req.params.page, req.query.sortDir, req.query.sortColumn)
            this.message = result;
        } catch (error) {
            this.httpStatus = httpStatusCodes.BadRequest;
            this.message = {msg: error.message};
        }
        res.status(this.httpStatus).json(this.message);
    }

    updateTodoItem(req, res) {
        todoListModel.updateTodoItem(req.params.objectId, req.body).then(response => {
            res.json(response);
        }).catch(error => {
            res.status(httpStatusCodes.BadRequest).json({msg: error.message});
        });
    }

    getPaginationData(req, res) {
        todoListModel.getCountPages().then(response => {
            res.json({totalPages: (response)});
        })
    }

    addListItem(req, res) {
        let newTodoItem = req.body;
        newTodoItem.belongsTo = req.user.userId;
        todoListModel.addTodoItem(newTodoItem).then(response => {
            res.json(response);
        }).catch(error => {
           res.status(httpStatusCodes.BadRequest).json({msg: error.message});
        });
    }

    async deleteTodoItem(req, res) {
        try {
            if(!req.user.isAdmin) {
                throw new Error('Is not admin!');
            }
            this.message = todoListModel.deleteTodoItem(req.params.objectId);

        } catch(error) {
            this.httpStatus = httpStatusCodes.BadRequest;
            this.message = {msg: error.message};
        }

        res.status(this.httpStatus).json(this.message);
    }

}

module.exports = new todoListController();