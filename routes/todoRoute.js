const router = require('express').Router();
const todoItemsController = require('../controllers/todoItemsController');

router.get('/pagination', todoItemsController.getPaginationData);

/**
 * Accepts query options:
 * sortDir: ASC or DESC
 */
router.get('/allTodoItems/:page?', todoItemsController.getAllTodoItems);

router.post('/addTodoItem', todoItemsController.addListItem);

router.put('/updateTodoItem/:objectId', todoItemsController.updateTodoItem);

router.delete('/deleteTodoItem/:objectId', todoItemsController.deleteTodoItem);

module.exports = router