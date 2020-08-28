const router = require('express').Router();
const authController = new (require('../controllers/authController'))();

router.post('/', authController.authenticateUser.bind(authController));

module.exports = router;