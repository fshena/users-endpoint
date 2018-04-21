const { object: objHelper } = require('@localleague/helpers');
const { Op }                = require('sequelize');

const models     = require('../../models');
const apiConfig  = require('../../config/api-config');
const getUserDto = require('../../dto/users/get-dto');

/**
 * Get specific users entry.
 * @param {{id: string, fields: array}} payload
 * @return {Promise<Model>}
 */
exports.getUserById = (payload) => {
    const sqlQuery = {
        where: {
            [Op.and]: {
                uid: payload.id,
            },
        },
        // include: [{ model: models.Player }],
    };
    if (payload.fields) {
        // get the mysql field names corresponding to the fields in the request
        sqlQuery.attributes = objHelper.getDbFieldsNames(
            getUserDto.getMap(),
            payload.fields.split(',')
        );
    }
    return models.User.findOne(sqlQuery);
};

/**
 * Get all users.
 * @param {object} req
 * @return {Promise<Array<Model>>}
 */
exports.getAllUsers = (req) => {
    const limit = parseInt(req.query.limit, 10) || apiConfig.query.maxLimit;
    const sqlQuery = {
        limit,
        offset: parseInt(req.query.offset, 10) * limit || 0,
        order: [],
        raw: true
    };
    if (req.params.fields) {
        // get the mysql field names corresponding to the fields in the request
        sqlQuery.attributes = objHelper.getDbFieldsNames(
            getUserDto.getMap(),
            req.params.fields.split(',')
        );
    }
    if (req.query.sort) {
        // get the field name for sorting
        const sortField = objHelper.getDbFieldsNames(
            getUserDto.getMap(),
            req.query.sort.split(','),
        )[0];
        sqlQuery.order.push([sortField, req.query.order || 'ASC']);
    }
    return models.User.findAndCountAll(sqlQuery);
};

/**
 * Create new users entry if the users doesn't already exist.
 * @param {object} user
 * @return {Promise<Model, created>}
 */
exports.createUser = (user) => {
    const newUser = user;
    const conditions = {
        where: {
            [Op.and]: {
                email: newUser.email,
            },
        },
        defaults: newUser,
    };
    return models.User.findOrCreate(conditions);
};

/**
 * Update users entry.
 * @param {string} id
 * @param {object} newUser
 * @return {Promise<Model>}
 */
exports.updateUser = (id, newUser) => models.User.update(newUser, {
    where: {
        [Op.and]: {
            uid: id,
        },
    },
});

/**
 * Delete specific users entry.
 * @param {string} id
 * @return {Promise<Model>}
 */
exports.deleteUser = id => models.User.destroy({
    where: {
        [Op.and]: {
            uid: id,
        },
    },
});

/**
 * Update specific fields of a users entry.
 * @param {string} id
 * @param {object} data
 * @return {Promise<Model>}
 */
exports.patchUser = (id, data) => {
    const attributes = {};
    attributes[data.path] = data.value;
    return models.User.update(attributes, {
        where: {
            [Op.and]: {
                uid: id,
            },
        },
    });
};

/**
 * Check if the users exists in the database.
 * @param {string} email
 * @return {Promise<Model>}
 */
exports.userExists = email => models.User.findOne({
    where: {
        [Op.and]: {
            email,
        },
    },
});

/**
 * Update specific fields of a users entry.
 * @param {numeric} userId
 * @return {Promise<Model>}
 */
exports.activateUser = userId => models.User.update({ is_active: 1 }, {
    where: {
        [Op.and]: {
            id: userId,
        },
    }
});
