const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const {isEmpty, isNull, isNotEmpty} = require('../utilities/helperFunctions');

class userModel {
    userSchema = new mongoose.Schema({
        username:  { type: String, required: true },
        passwordHash: { type: String, required: true },
        firstName: { type: String, required: true },
        surname: { type: String, required: true},
        roles: {
            type: [{
                type: String,
                required: true,
                default: 'user',
                enum: ['admin', 'user']
            }],
            default: ['user'],
        }
    }, {versionKey: false, timestamps: true, strict: "throw"});

    userModel = mongoose.model('users', this.userSchema);

    async createUser (userObject, createAdmin = false) {
        if(! ("username" in userObject) || !userObject['username']) {
            throw new Error('Missing the key username!');
        }
        if(! ("password" in userObject) || !userObject['password']) {
            throw new Error('Missing the key password!')
        }

        if(await this.userExistsByUsername(userObject.username)) throw new Error('Username already exists!');

        try {
            let newUserObject = {
                "username": userObject.username,
                "passwordHash": bcrypt.hashSync(userObject.password, Number(process.env.NUMBER_OF_SALTS)),
                "firstName": userObject.firstName,
                "surname": userObject.surname,
                "roles": (createAdmin) ? ['admin', 'user'] : undefined
            }
            let result = await this.userModel.create(newUserObject);

            return {
                _id: result._id.toString(),
                username: result.username,
                roles: result.roles
            }
        } catch(error) {
            throw new Error(error.message);
        }

    }

    async authenticateUser(username, password) {
        if(isEmpty(username), isEmpty(password)) throw new Error('Missing keys \'username\' or \'password\'');
        let userObject = await this.findUserByUsername(username);
        if(isNull(userObject) || isNull(userObject.passwordHash)) throw new Error('Username not found');

        if(!this.verifyPassword(password, userObject.passwordHash)) throw new Error('Invalid password');

        return this.signToken({'_id': userObject._id, 'roles': userObject.roles});
    }

    signToken(payload) {
        try {
            return jwt.sign(payload, process.env.JWT_SECRET);
        } catch(error) {
            throw new Error(error.message);
        }
    }

    verifyPassword(password, passwordHash) {
        return bcrypt.compareSync(password, passwordHash);
    }

    async userExistsByUsername (username) {
        let result = await this.findUserByUsername(username);
        result = isNull(result) ? result : result._doc
        return isNotEmpty(result);
    }

    async userExistByUserId(id) {
        let result = await this.findUserById(id);
        result = isNull(result) ? result : result._doc
        return isNotEmpty(result);
    }

    async findUserByUsername (username) {
        return await this.findUser({username});
    }

    async findUserById(_id) {
        return await this.findUser({_id});
    }

    async findUser(userObject) {
        let result = await this.userModel.findOne(userObject);
        return result;
    }

    verifyToken(token) {
        return jwt.verify(token, process.env["JWT_SECRET"]);
    }

    async deleteUser(_id) {
        try {
            let result = await this.userModel.deleteOne({_id});
            return {totalRemoved: result.n}
        } catch (error) {
            throw new Error(error.message);
        }
    }
}

module.exports = new userModel();