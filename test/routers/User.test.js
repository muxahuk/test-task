const createUserRouter = require('../../routers/User');
const UserModel = require('../../models/User');
const UserController = require('../../controllers/User');

class FakeRouter {
    get () { return this; }
    post () { return this; }
    put () { return this; }
}

describe('createUserRouter', () => {
    const userController = new UserController(UserModel);
    let getSpy, postSpy, putSpy;
    before(() => {
        getSpy = sinon.spy(FakeRouter.prototype, 'get');
        postSpy = sinon.spy(FakeRouter.prototype, 'post');
        putSpy = sinon.spy(FakeRouter.prototype, 'put');
    });
    afterEach(() => {
        getSpy.resetHistory();
        postSpy.resetHistory();
        putSpy.resetHistory();
    });
    it('should be a function', () => {
        expect(createUserRouter).to.be.an.instanceOf(Function);
    });
    it('should call .get method twice on Router instance', () => {
        createUserRouter(FakeRouter, userController);
        expect(getSpy).to.have.been.calledTwice;
    });
    it('should call .get method first time called with "/" and controller.getAll function', () => {
        createUserRouter(FakeRouter, userController);
        expect(getSpy.getCall(0)).to.have.been.calledWith('/');
    });
    it('should call .get method first time called with "/:login" and controller.get function', () => {
        createUserRouter(FakeRouter, userController);
        expect(getSpy.getCall(1)).to.have.been.calledWith('/:login');
    });
    it('should call .post method once on Router instance', () => {
        createUserRouter(FakeRouter, userController);
        expect(postSpy).to.have.been.calledOnce;
    });
    it('should call .get method first time called with "/:login" and controller.get function', () => {
        createUserRouter(FakeRouter, userController);
        expect(getSpy).to.have.been.calledWith('/');
    });
    it('should call .put method once on Router instance', () => {
        createUserRouter(FakeRouter, userController);
        expect(putSpy).to.have.been.calledOnce;
    });
    it('should call .get method first time called with "/:login" and controller.get function', () => {
        createUserRouter(FakeRouter, userController);
        expect(putSpy).to.have.been.calledWith('/:login');
    });
    it('should return instance of FakeRouter', () => {
        expect(createUserRouter(FakeRouter, userController)).to.be.an.instanceOf(FakeRouter);
    });
});
