const todoListModel = require('../models/todolist');
const httpStatusCodes = require('../utilities/http-statusCodes');

class todoListController {

    getAllTodoItems(req, res) {
        const defaultPageIndex = 0;
        if(!req.params.page) req.params.page = defaultPageIndex;
        todoListModel.getTodoList(req.params.page, req.query.sortDir, req.query.sortColumn).then(response => {
            res.json(response);
        }).catch(error => {
            res.status(httpStatusCodes.BadRequest).json({msg: error.message});
        }) ;
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
        todoListModel.addTodoItem(req.body).then(response => {
            res.json(response);
        }).catch(error => {
           res.status(httpStatusCodes.BadRequest).json({msg: error.message});
        });
    }

    deleteTodoItem(req, res) {
        todoListModel.deleteTodoItem(req.params.objectId).then(response => {
            res.json(response);
        }).catch(error => {
            res.status(httpStatusCodes.BadRequest).json({msg: error.message});
        })
    }

}

module.exports = new todoListController();