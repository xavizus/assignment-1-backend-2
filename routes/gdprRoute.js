const router = require('express').Router();
const gdprController = require('../controllers/gdprController');
const verifyToken = require('../controllers/authController').verifyToken;

router.delete('/', verifyToken.bind(),  gdprController.clearUserInformation.bind(gdprController));
router.get('/', verifyToken.bind(),  gdprController.getUserInformation.bind(gdprController));
router.get('/cookiePolicy', gdprController.getCookiePolicy.bind(gdprController));

module.exports = router