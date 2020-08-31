const baseController = require('./baseController');
const httpStatusCodes = require('../utilities/http-statusCodes');
const userModel = require('../models/userModel');

class authController extends baseController {
    constructor() {
        super();
    }

    async authenticateUser(req, res) {
        try {
            let token = await userModel.authenticateUser(req.body.username, req.body.password);
            this.message = {token};
        } catch(error) {
            this.httpStatus = httpStatusCodes.BadRequest;
            this.message = {msg: error.message};
        }

        res.status(this.httpStatus).json(this.message);
    }

    static verifyToken(req, res, next) {
        try {
            let authorizationHeader = req.headers.authorization;
            let token = authorizationHeader.substr(authorizationHeader.lastIndexOf(' ')+1);
            let result = userModel.verifyToken(token);
            req.user = {
                userId: result._id,
                isAdmin: result.roles.includes('admin')
            }
            next();
        } catch(error) {
            res.sendStatus(httpStatusCodes.Unauthorized);
        }
    }

}

module.exports = authController;
