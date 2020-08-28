const router = require('express').Router();
const userController = require('../controllers/userController');
const verifyToken = require('../controllers/authController').verifyToken;

router.post('/', verifyToken.bind(userController),  userController.registerUser.bind(userController));

module.exports = router;