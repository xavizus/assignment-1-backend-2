const todoListModel = require('../models/todolist');

class todoListController {

    getAllTodoItems(req, res) {
        if(!req.params.page) req.params.page = 0;
        todoListModel.getTodoList(req.params.page, req.query.sortDir).then(response => {
            res.json(response);
        }).catch(error => {
            res.status(400).json({msg: error.message});
        }) ;
    }

    updateTodoItem(req, res) {
        todoListModel.updateTodoItem(req.params.objectId, req.body).then(response => {
            res.json(response);
        }).catch(error => {
            res.status(400).json({msg: error.message});
        });
    }

    getPaginationData(req, res) {
        todoListModel.getCountPages().then(response => {
            res.json(response);
        })
    }

    addListItem(req, res) {
        todoListModel.addTodoItem(req.body).then(response => {
            res.json(response);
        }).catch(error => {
           res.status(400).json({msg: error.message});
        });
    }

    deleteTodoItem(req, res) {
        todoListModel.deleteTodoItem(req.params.objectId).then(response => {
            res.json(response);
        }).catch(error => {
            res.status(400).json({msg: error.message});
        })
    }

}

module.exports = new todoListController();