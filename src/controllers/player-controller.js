const { paginationLinks }     = require('@localleague/helpers');
const httpStatus              = require('http-status-codes');
const yaml                    = require('yamljs');

const { query: { maxLimit } } = require('../config/api-config');
const playerMySqlRepository   = require('../repository/mysql/player-repository');
const errorController         = require('./error-controller');
const getPlayerDto            = require('../dto/players/get-dto');
const postPlayerDto           = require('../dto/players/post-dto');
const playerCollectionDto     = require('../dto/players/collection-dto');

/**
 * Query database for using player id.
 * @param {Object} req
 * @param {Object} res
 * @param {function} next
 */
exports.getById = (req, res, next) => {
    const sendResponse = (player) => {
        const status = player ? httpStatus.OK : httpStatus.NOT_FOUND;
        res.status(status);
        if (status === httpStatus.NOT_FOUND) {
            return res.json();
        }
        return res.json(getPlayerDto.map(player));
    };
    playerMySqlRepository
        .getPlayerById({ playerId: req.params.id, fields: req.params.fields })
        .then(sendResponse)
        .catch(errors => errorController(errors, next));
};

/**
 * Get all player form the database.
 * @param {Object} req
 * @param {Object} res
 * @param {function} next
 */
exports.get = (req, res, next) => {
    const sendResponse = (players) => {
        res.set({
            Link: paginationLinks(req, players.count, maxLimit),
            'X-Total-Count': players.count,
        });
        res.status(httpStatus.OK);
        return res.json(playerCollectionDto(players.rows));
    };
    playerMySqlRepository
        .getAllPlayers(req)
        .then(sendResponse)
        .catch(errors => errorController(errors, next));
};

/**
 * Save players in the database.
 * @param {Object} req
 * @param {Object} res
 * @param {function} next
 */
exports.post = (req, res, next) => {
    const sendResponse = (player, created) => {
        const createdPlayer = player.get({ plain: true });
        let status = httpStatus.CREATED;
        // If no new player was created because it already exists.
        if (!created && createdPlayer) {
            status = httpStatus.NOT_MODIFIED;
        }
        // The link where to find the new player or the existing one.
        res.header('Content-Location', `${req.route.path}/${createdPlayer.id}`);
        res.status(status);
        res.json(getPlayerDto.map(player));
    };
    playerMySqlRepository
        .createPlayer(postPlayerDto(req.body))
        .spread(sendResponse)
        .catch(errors => errorController(errors, next));
};

/**
 * Delete player from the database.
 * @param {Object} req
 * @param {Object} res
 * @param {function} next
 */
exports.delete = (req, res, next) => {
    const sendResponse = (deleted) => {
        // Send different status if record for deletion exists or not.
        const status = deleted ? httpStatus.NO_CONTENT : httpStatus.NOT_FOUND;
        res.status(status);
        res.json();
    };
    playerMySqlRepository
        .deletePlayer(req.params.id)
        .then(sendResponse)
        .catch(errors => errorController(errors, next));
};

/**
 * Send a json representation of the swagger file.
 * @param {Object} req
 * @param {Object} res
 */
exports.docs = (req, res) => {
    const nativeObj = yaml.load(`${__dirname}/../../docs/players_swagger.yaml`);
    res.json(nativeObj);
};


/**
 * Update players data.
 * @param {Object} req
 * @param {Object} res
 * @param {function} next
 */
/* exports.put = (req, res, next) => {
    const sendResponse = (updated) => {
        const status = updated[0] > 0
            ? httpStatus.NO_CONTENT
            : httpStatus.NOT_FOUND;
        res.status(status);
        res.json();
    };
    const updateUserData = () => {
        userMySqlRepository
            .updateUser(req.params.id, putUserDto(req.body))
            .then(sendResponse)
            .catch(errors => errorController(errors, next));
    };
    playerMySqlRepository
        .updatePlayer(req.params.id, putPlayerDto(req.body))
        .then(updateUserData)
        .catch(errors => errorController(errors, next));
}; */
