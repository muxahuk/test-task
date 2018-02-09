const { UNIQUE_VIOLATION } = require('pg-error-constants');

class UserController {
    static _formatValidationError (e) {
        if (e.name === 'Error' && e.data) {
            const message = `${e.data[0].dataPath ? `'${e.data[0].dataPath.split('.')[1]}' ` : ''}${e.data[0].message}`;
            const error = new Error(`Validation Error: ${message}`);
            error.stack = e.stack;
            return error;
        }
        return e;
    }

    constructor (UserModel) {
        this._UserModel = UserModel;
    }

    async getAll (req, res, next) {
        try {
            const users = await this._UserModel.query() || [];
            res.json(users);
        } catch (e) {
            next(e);
        }
    }

    async get (req, res, next) {
        const { login } = req.params;
        try {
            const user = await this._UserModel.query().where({ login }).first();
            if (!user) {
                throw new Error('No such user');
            }
            res.json(user);
        } catch (e) {
            next(e);
        }
    }

    async post (req, res, next) {
        const { login, email, name } = req.body;
        try {
            const user = new this._UserModel({ login, email, name, age: req.body.age !== undefined ? parseInt(req.body.age, 10) : null });
            user.validate();
            await user.save();
            res.json(user);
        } catch (e) {
            if (e.code && e.code === UNIQUE_VIOLATION) {
                const error = new Error('User with such login already exists');
                error.stack = e.stack;
                return next(error);
            }
            next(this.constructor._formatValidationError(e));
        }
    }

    async put (req, res, next) {
        const { login } = req.params;
        try {
            const user = await this._UserModel.query().where({ login }).first();
            if (!user) {
                throw new Error('No such user');
            }

            ['email', 'name', 'age']
                .filter((i) => req.body[i] !== undefined)
                .forEach((i) => (user[i] = (i === 'age') ? parseInt(req.body[i], 10) : req.body[i]));

            user.validate();
            await user.save();
            res.json(user);
        } catch (e) {
            next(this.constructor._formatValidationError(e));
        }
    }
}

module.exports = UserController;
