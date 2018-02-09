const { UNIQUE_VIOLATION } = require('pg-error-constants');

class UserController {
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
        // Since no requirements where given i do not check the params.
        // But, if necessary, we should check if they are empty and fail earlier
        const user = new this._UserModel({ login, email, name, age: req.body.age !== undefined ? parseInt(req.body.age, 10) : null });
        try {
            await user.save();
            res.json(user);
        } catch (e) {
            if (e.code && e.code === UNIQUE_VIOLATION) {
                const error = new Error('User with such login already exists');
                error.stack = e.stack;
                return next(error);
            }
            next(e);
        }
    }

    async put (req, res, next) {
        const { login } = req.params;
        try {
            const user = await this._UserModel.query().where({ login }).first();
            if (!user) {
                throw new Error('No such user');
            }
            // login is primary key, don't know if it should be possible to change it. assuming not.
            ['email', 'name', 'age']
                .filter((i) => req.body[i] !== undefined)
                .forEach((i) => (user[i] = (i === 'age') ? parseInt(req.body[i], 10) : req.body[i]));
            await user.save();
            res.json(user);
        } catch (e) {
            next(e);
        }
    }
}

module.exports = UserController;
