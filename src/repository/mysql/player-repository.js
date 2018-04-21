const { object: objHelper }   = require('@localleague/helpers');
const { Op }                  = require('sequelize');

const { query: { maxLimit } } = require('../../config/api-config');
const models                  = require('../../models');
const getPlayerDto            = require('../../dto/players/get-dto');

/**
 * Get specific player entry.
 * @param {{playerId:numeric, fields:array}} payload
 * @return {Promise<Array<Model>>}
 */
exports.getPlayerById = (payload) => {
    const sqlQuery = {
        where: {
            [Op.and]: {
                id: payload.playerId,
            },
        },
        include: [
            {
                model: models.User,
                required: true
            },
        ],
    };
    // since the player's attributes are held on the 'user' and 'player' table,
    // we need to request the fields from separate models.
    if (payload.fields) {
        // get the players' fields that can be included in the request
        const playerFields = objHelper.getDbFieldsNames(
            getPlayerDto.getMap('player'),
            payload.fields.split(',')
        );
        if (playerFields) {
            sqlQuery.attributes = playerFields;
        }
        // get the users' fields that can be included in the request
        const userFields = objHelper.getDbFieldsNames(
            getPlayerDto.getMap('user'),
            payload.fields.split(',')
        );
        if (userFields) {
            sqlQuery.include[0].attributes = userFields;
        }
    }
    return models.Player.findOne(sqlQuery);
};

/**
 * Get all players.
 * @param {Object} req
 * @return {Promise<Array<Model>>}
 */
exports.getAllPlayers = (req) => {
    const limit = parseInt(req.query.limit, 10) || maxLimit;
    const sqlQuery = {
        limit,
        offset: parseInt(req.query.offset, 10) * limit || 0,
        order: [
            [
                req.query.sort || models.User.attributes.email,
                req.query.order || 'ASC',
            ],
        ],
        include: [
            {
                model: models.User,
                required: true
            },
        ],
    };
    // since the player's attributes are held on the 'user' and 'player' table,
    // we need to request the fields from separate models.
    if (req.params.fields) {
        // get the players' fields that can be included in the request
        const playerFields = objHelper.getDbFieldsNames(
            getPlayerDto.getMap('player'),
            req.params.fields.split(',')
        );
        if (playerFields) {
            sqlQuery.attributes = playerFields;
        }
        // get the users' fields that can be included in the request
        const userFields = objHelper.getDbFieldsNames(
            getPlayerDto.getMap('user'),
            req.params.fields.split(',')
        );
        if (userFields) {
            sqlQuery.include[0].attributes = userFields;
        }
    }
    return models.Player.findAndCountAll(sqlQuery);
};

/**
 * Create new player entry if the player doesn't already exist.
 * @param {Object} newPlayer
 * @return {Promise<Model, created>}
 */
exports.createPlayer = (newPlayer) => {
    const conditions = {
        where: {
            [Op.and]: {
                user_id: newPlayer.user_id,
            },
        },
        defaults: newPlayer,
    };
    return models.Player.findOrCreate(conditions);
};

/**
 * Update player entry.
 * @param {numeric} userId
 * @param {Object} updatePlayer
 * @return {Promise}
 */
exports.updatePlayer = (userId, updatePlayer) => {
    const conditions = {
        where: {
            [Op.and]: {
                user_id: userId,
            },
        },
    };
    return models.Player.update(updatePlayer, conditions);
};


/**
 * Find if user has "Player" data.
 * @param {numeric} userId
 * @return {Promise<Model>}
 */
exports.isPlayer = userId => models.Player.findOne({
    where: {
        [Op.and]: {
            user_id: userId,
        },
    },
    attributes: ['id'],
});
