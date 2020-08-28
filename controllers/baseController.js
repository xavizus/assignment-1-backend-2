const httpStatusCodes = require('../utilities/http-statusCodes');


class baseController {
    httpStatus = httpStatusCodes.OK;
    message;
}

module.exports = baseController