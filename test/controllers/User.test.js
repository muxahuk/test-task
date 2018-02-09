const { UNIQUE_VIOLATION } = require('pg-error-constants');

const UserModel = require('../../models/User');
const UserController = require('../../controllers/User');

function create (Model) {
    if (Model === undefined) {
        Model = UserModel;
    }
    return new UserController(Model);
}

describe('UserController', () => {
    let tracker;
    const res = {
        json: sinon.spy()
    };
    const next = sinon.spy();
    beforeEach(() => {
        tracker = getTracker();
        tracker.install();
    });
    afterEach(() => {
        tracker.uninstall();
        res.json.resetHistory();
        next.resetHistory();
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
    describe('.constructor(UserModel)', () => {
        it('should set ._UserModel property', () => {
            const Model = class Model {};
            const instance = create(Model);
            expect(instance._UserModel).to.equal(Model);
        });
    });
    describe('.getAll(req, res, next)', () => {
        const req = {};
        context('when there is no error', () => {
            beforeEach(() => {
                tracker.on('query', (query) => query.response(users));
            });
            it('should call res.json method once', async () => {
                const instance = create();
                await instance.getAll(req, res, next);
                expect(res.json.calledOnce).to.equal(true);
            });
            it('should call res.json method with users array', async () => {
                const instance = create();
                await instance.getAll(req, res, next);
                expect(res.json.calledWith(users)).to.equal(true);
            });
        });
        context('when db query fails with error', () => {
            const error = new Error('fail');
            beforeEach(() => {
                tracker.on('query', (query) => query.reject(error));
            });
            it('should call next method once', async () => {
                const instance = create();
                await instance.getAll(req, res, next);
                expect(next).to.have.been.calledOnce;
            });
            it('should call next method with error', async () => {
                const instance = create();
                await instance.getAll(req, res, next);
                expect(next).to.have.been.calledWith(error);
            });
        });
    });
    describe('.get(req, res, next)', () => {
        context('when user is found in database', () => {
            const req = {
                params: {
                    login: 'test'
                }
            };
            beforeEach(() => {
                tracker.on('query', (query) => query.response(users[0]));
            });
            it('should call res.json method once', async () => {
                const instance = create();
                await instance.get(req, res, next);
                expect(res.json).to.have.been.calledOnce;
            });
            it('should call res.json method with users array', async () => {
                const instance = create();
                await instance.get(req, res, next);
                expect(res.json).to.have.been.calledWith(users[0]);
            });
        });
        context('when user is not found in database', () => {
            const req = {
                params: {
                    login: 'test3'
                }
            };
            beforeEach(() => {
                tracker.on('query', (query) => query.response(''));
            });
            it('should call next method once', async () => {
                const instance = create();
                await instance.get(req, res, next);
                expect(next).to.have.been.calledOnce;
            });
            it('should call next method with error', async () => {
                const instance = create();
                await instance.get(req, res, next);
                expect(next).to.have.been.calledWithMatch(Error);
            });
            it('should call next method with error message "No such user"', async () => {
                const instance = create();
                await instance.get(req, res, next);
                expect(next).to.have.been.calledWithMatch(sinon.match.has('message', 'No such user'));
            });
        });
        context('when db query fails with error', () => {
            const req = {
                params: {
                    login: 'test3'
                }
            };
            const error = new Error('fail');
            beforeEach(() => {
                tracker.on('query', (query) => query.reject(error));
            });
            it('should call next method once', async () => {
                const instance = create();
                await instance.get(req, res, next);
                expect(next).to.have.been.calledOnce;
            });
            it('should call next method with error', async () => {
                const instance = create();
                await instance.get(req, res, next);
                expect(next).to.have.been.calledWith(error);
            });
        });
    });
    describe('.post(req, res, next)', () => {
        const newUser = {
            login: 'test',
            email: 'email@mail.loc',
            name: 'Test',
            age: 20
        };
        const req = {
            body: newUser
        };
        context('when user gets saved into database', () => {
            beforeEach(() => {
                tracker.on('query', (query) => query.response(''));
            });
            it('should call res.json method once', async () => {
                const instance = create();
                await instance.post(req, res, next);
                expect(res.json).to.have.been.calledOnce;
            });
            it('should call res.json method with users array', async () => {
                const instance = create();
                await instance.post(req, res, next);
                expect(res.json).to.have.been.calledWith(newUser);
            });
        });
        context('when login is already being used in database', () => {
            const error = new Error('fail');
            error.code = UNIQUE_VIOLATION;
            beforeEach(() => {
                tracker.on('query', (query) => query.reject(error));
            });
            it('should call next method once', async () => {
                const instance = create();
                await instance.post(req, res, next);
                expect(next).to.have.been.calledOnce;
            });
            it('should call next method with error', async () => {
                const instance = create();
                await instance.post(req, res, next);
                expect(next).to.have.been.calledWithMatch(Error);
            });
            it('should call next method with error message "User with such login already exists"', async () => {
                const instance = create();
                await instance.post(req, res, next);
                expect(next).to.have.been.calledWithMatch(sinon.match.has('message', 'User with such login already exists'));
            });
        });
        context('when db query fails with error', () => {
            const error = new Error('fail');
            beforeEach(() => {
                tracker.on('query', (query) => query.reject(error));
            });
            it('should call next method once', async () => {
                const instance = create();
                await instance.post(req, res, next);
                expect(next).to.have.been.calledOnce;
            });
            it('should call next method with error', async () => {
                const instance = create();
                await instance.post(req, res, next);
                expect(next).to.have.been.calledWith(error);
            });
        });
    });
    describe('.put(req, res, next)', () => {
        const updateUser = {
            email: 'email2@mail.loc',
            name: 'Test3',
            age: 22
        };
        const req = {
            body: updateUser,
            params: {
                login: 'test'
            }
        };
        context('when user gets found in database', () => {
            beforeEach(() => {
                tracker.on('query', (query) => {
                    if (query.method === 'first') {
                        query.response(users[0]);
                    } else if (query.method === 'update') {
                        query.response('');
                    }
                });
            });
            it('should call res.json method once', async () => {
                const instance = create();
                await instance.put(req, res, next);
                expect(res.json).to.have.been.calledOnce;
            });
            it('should call res.json method with UserModel instance', async () => {
                const instance = create();
                await instance.put(req, res, next);
                expect(res.json).to.have.been.calledWithMatch(sinon.match.instanceOf(UserModel));
            });
        });
        context('when user does not gets found in database', () => {
            beforeEach(() => {
                tracker.on('query', (query) => {
                    if (query.method === 'first') {
                        query.response('');
                    }
                });
            });
            it('should call next method once', async () => {
                const instance = create();
                await instance.put(req, res, next);
                expect(next).to.have.been.calledOnce;
            });
            it('should call next method with error', async () => {
                const instance = create();
                await instance.put(req, res, next);
                expect(next).to.have.been.calledWithMatch(Error);
            });
            it('should call next method with error message "No such user"', async () => {
                const instance = create();
                await instance.put(req, res, next);
                expect(next).to.have.been.calledWithMatch(sinon.match.has('message', 'No such user'));
            });
        });
        context('when db query fails with error', () => {
            const error = new Error('fail');
            beforeEach(() => {
                tracker.on('query', (query) => query.reject(error));
            });
            it('should call next method once', async () => {
                const instance = create();
                await instance.put(req, res, next);
                expect(next).to.have.been.calledOnce;
            });
            it('should call next method with error', async () => {
                const instance = create();
                await instance.put(req, res, next);
                expect(next).to.have.been.calledWith(error);
            });
        });
    });
});
