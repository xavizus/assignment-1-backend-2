const userModel = require('../models/userModel');
const baseController = require('./baseController');
const httpStatusCodes = require('../utilities/http-statusCodes');

class userController extends baseController {

    constructor() {
        super();
    }

    async registerUser(req, res) {
        try {
            if(!req.user.isAdmin) {
                throw new Error('Is not admin');
            }
            this.message = await userModel.createUser(req.body);
        } catch (error) {
            this.message = {msg: error.message};
        }
        res.status(this.httpStatus).json(this.message)
    }
}

module.exports = new userController();
