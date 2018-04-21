const queryMiddleware   = require('../middleware/query-middleware');
const fieldsMiddleware  = require('../middleware/fields-middleware');
const playersController = require('../controllers/player-controller');

module.exports = (server) => {
    server.get(
        { path: '/players', name: 'getPlayers' },
        queryMiddleware,
        fieldsMiddleware,
        playersController.get
    );
    server.get(
        { path: '/players/:id([0-9]+)', name: 'getPlayersById' },
        queryMiddleware,
        fieldsMiddleware,
        playersController.getById
    );
    server.get(
        { path: '/players/swagger.json', name: 'docsPlayers' },
        playersController.docs
    );
    /* server.del(
        { path: '/players/:id([0-9]+)', name: 'deletePlayers' },
        playersController.delete
    );
    server.post(
        { path: '/players', name: 'postPlayers' },
        playersController.post
    );
    server.put(
        { path: '/players/:id([0-9]+)', name: 'putPlayers' },
        playersController.put
    ); */
};
