const app = require('../app');

describe('Server', () => {
    let tracker = getTracker();
    beforeEach(() => {
        tracker.install();
    });
    afterEach(() => {
        tracker.uninstall();
    });

    const users = [
        {
            login: 'test',
            email: 'test@mail.test',
            name: 'Test',
            age: 20
        },
        {
            login: 'test2',
            email: 'test2@mail.test',
            name: 'Test2',
            age: 22
        }
    ];
    describe('GET /user', () => {
        context('when DB responds with users', () => {
            beforeEach(() => {
                tracker.on('query', (query) => query.response(users));
            });
            it('should respond with Content-Type "json"', () => {
                return supertest(app)
                    .get('/user')
                    .expect('Content-Type', /json/);
            });
            it('should respond with 200 status code', () => {
                return supertest(app)
                    .get('/user')
                    .expect(200);
            });
            it('should respond with users array', () => {
                return supertest(app)
                    .get('/user')
                    .expect(users);
            });
        });
        context('when DB fails', () => {
            const error = new Error('fail');
            beforeEach(() => {
                tracker.on('query', (query) => query.reject(error));
            });
            it('should respond with Content-Type "json"', () => {
                return supertest(app)
                    .get('/user')
                    .expect('Content-Type', /json/);
            });
            it('should respond with 500 status code', () => {
                return supertest(app)
                    .get('/user')
                    .expect(500);
            });
        });
    });
    describe('GET /user/:login', () => {
        context('when DB responds with user', () => {
            beforeEach(() => {
                tracker.on('query', (query) => query.response(users[0]));
            });
            it('should respond with Content-Type "json"', () => {
                return supertest(app)
                    .get('/user/test')
                    .expect('Content-Type', /json/);
            });
            it('should respond with 200 status code', () => {
                return supertest(app)
                    .get('/user/test')
                    .expect(200);
            });
            it('should respond with user object', () => {
                return supertest(app)
                    .get('/user/test')
                    .expect(users[0]);
            });
        });
        context('when DB fails', () => {
            const error = new Error('fail');
            beforeEach(() => {
                tracker.on('query', (query) => query.reject(error));
            });
            it('should respond with Content-Type "json"', () => {
                return supertest(app)
                    .get('/user/test')
                    .expect('Content-Type', /json/);
            });
            it('should respond with 500 status code', () => {
                return supertest(app)
                    .get('/user/test')
                    .expect(500);
            });
        });
    });
    describe('POST /user', () => {
        const newUser = {
            login: 'test3',
            email: 'test3@mail.loc',
            name: 'Test3',
            age: 25
        };
        context('when DB responds with user', () => {
            beforeEach(() => {
                tracker.on('query', (query) => query.response(users[0]));
            });
            it('should respond with Content-Type "json"', () => {
                return supertest(app)
                    .post('/user')
                    .send(newUser)
                    .expect('Content-Type', /json/);
            });
            it('should respond with 200 status code', () => {
                return supertest(app)
                    .post('/user')
                    .send(newUser)
                    .expect(200);
            });
            it('should respond with new user object', () => {
                return supertest(app)
                    .post('/user')
                    .send(newUser)
                    .expect(newUser);
            });
        });
        context('when DB fails', () => {
            const error = new Error('fail');
            beforeEach(() => {
                tracker.on('query', (query) => query.reject(error));
            });
            it('should respond with Content-Type "json"', () => {
                return supertest(app)
                    .post('/user')
                    .send(newUser)
                    .expect('Content-Type', /json/);
            });
            it('should respond with 500 status code', () => {
                return supertest(app)
                    .post('/user')
                    .send(newUser)
                    .expect(500);
            });
        });
    });
    describe('PUT /user/:login', () => {
        const oldUser = {
            login: 'test3',
            email: 'test4@mail.loc',
            name: 'Test4',
            age: 27
        };
        const updateUser = {
            email: 'test3@mail.loc',
            name: 'Test3',
            age: 25
        };
        const newUser = Object.assign({}, updateUser, { login: 'test3' });
        context('when DB responds with user', () => {
            beforeEach(() => {
                tracker.on('query', (query) => query.response(oldUser));
            });
            it('should respond with Content-Type "json"', () => {
                return supertest(app)
                    .put('/user/test3')
                    .send(updateUser)
                    .expect('Content-Type', /json/);
            });
            it('should respond with 200 status code', () => {
                return supertest(app)
                    .put('/user/test3')
                    .send(updateUser)
                    .expect(200);
            });
            it('should respond with updated user object', () => {
                return supertest(app)
                    .put('/user/test3')
                    .send(updateUser)
                    .expect(newUser);
            });
        });
        context('when DB fails', () => {
            const error = new Error('fail');
            beforeEach(() => {
                tracker.on('query', (query) => query.reject(error));
            });
            it('should respond with Content-Type "json"', () => {
                return supertest(app)
                    .put('/user/test3')
                    .send(updateUser)
                    .expect('Content-Type', /json/);
            });
            it('should respond with 500 status code', () => {
                return supertest(app)
                    .put('/user/test3')
                    .send(updateUser)
                    .expect(500);
            });
        });
    });
});
