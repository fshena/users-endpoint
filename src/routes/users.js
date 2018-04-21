const queryMiddleware  = require('../middleware/query-middleware');
const fieldsMiddleware = require('../middleware/fields-middleware');
const usersController  = require('../controllers/user-controller');

module.exports = (server) => {
    server.post(
        { path: '/users', name: 'postUsers' },
        usersController.post
    );
    server.get(
        { path: '/users', name: 'getUsers' },
        queryMiddleware,
        fieldsMiddleware,
        usersController.get
    );
    server.get(
        { path: '/users/:id([0-9a-zA-Z]+)', name: 'getUsersById' },
        queryMiddleware,
        fieldsMiddleware,
        usersController.getById
    );
    server.put(
        { path: '/users/:id([0-9a-zA-Z]+)', name: 'putUsers' },
        usersController.put
    );
    server.del(
        { path: '/users/:id([0-9a-zA-Z]+)', name: 'deleteUsers' },
        usersController.delete
    );
    server.get(
        { path: '/users/swagger.json', name: 'docsUsers' },
        usersController.docs
    );
};
