module.exports = function createUserRouter (Router, controller) {
    return new Router()
        .get('/', controller.getAll.bind(controller))
        .get('/:login', controller.get.bind(controller))
        .post('/', controller.post.bind(controller))
        .put('/:login', controller.put.bind(controller));
};
