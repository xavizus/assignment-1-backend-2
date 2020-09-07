const router = require('express').Router();
const verifyToken = require('../controllers/authController').verifyToken;
const todoListController = require('../controllers/todoListController');

router.get('/', verifyToken.bind(verifyToken()), todoListController.readTodoList.bind(todoListController));

router.post('/', verifyToken.bind(verifyToken), todoListController.createTodoList.bind(todoListController));

module.exports = router