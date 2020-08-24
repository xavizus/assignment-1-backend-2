const router = require('express').Router();
const todoItemsController = require('../controllers/todoItemsController');

router.get('/pagination', todoItemsController.getPaginationData);

router.get('/:page?', todoItemsController.getAllTodoItems);

router.post('/', todoItemsController.addListItem);

router.put('/:objectId', todoItemsController.updateTodoItem);

router.delete('/:objectId', todoItemsController.deleteTodoItem);

module.exports = router