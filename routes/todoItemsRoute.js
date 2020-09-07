const router = require('express').Router();
const verifyToken = require('../controllers/authController').verifyToken;
let todoItemsController = require('../controllers/todoItemsController');

router.get('/pagination', verifyToken.bind(todoItemsController), todoItemsController.getPaginationData.bind(todoItemsController));

router.get('/:page?', verifyToken.bind(todoItemsController), todoItemsController.getAllTodoItems.bind(todoItemsController));

router.post('/:todoListId', verifyToken.bind(todoItemsController), todoItemsController.addListItem.bind(todoItemsController));

router.patch('/:objectId', verifyToken.bind(todoItemsController), todoItemsController.updateTodoItem.bind(todoItemsController));

router.delete('/:objectId', verifyToken.bind(todoItemsController), todoItemsController.deleteTodoItem.bind(todoItemsController));

module.exports = router