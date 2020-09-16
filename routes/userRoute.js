const router = require('express').Router();
const userController = require('../controllers/userController');

router.post('/',  userController.registerUser.bind(userController));

module.exports = router;