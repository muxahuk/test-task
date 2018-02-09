const Database = require('../database');

class UserModel extends Database.Model {
    static get tableName () {
        return 'user';
    }
    static get primaryKey () {
        return 'login';
    }
    static get jsonSchema () {
        return {
            title: 'User',
            type: 'object',
            properties: {
                login: {
                    type: 'string'
                },
                email: {
                    type: 'string',
                    format: 'email'
                },
                name: {
                    type: 'string'
                },
                age: {
                    type: 'integer',
                    description: 'Age in years',
                    minimum: 0
                }
            },
            required: ['email', 'name', 'age']
        };
    }
}

Database.register(UserModel);

module.exports = UserModel;
