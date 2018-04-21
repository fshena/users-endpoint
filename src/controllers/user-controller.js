const helpers    = require('@localleague/helpers');
const httpStatus = require('http-status-codes');
const YAML       = require('yamljs');
const Errors     = require('restify-errors');

const userMySqlRepository   = require('../repository/mysql/user-repository');
const errorController       = require('./error-controller');
const getUserDto            = require('../dto/users/get-dto');
const putUserDto            = require('../dto/users/put-dto');
const userCollectionDto     = require('../dto/users/collection-dto');
const { query: maxLimit }   = require('../config/api-config');
const postUserDto           = require('../dto/users/post-dto');
const fireBaseService       = require('../services/firebase-service');

/**
 * Save users in the database.
 * @param {Object} req
 * @param {Object} res
 * @param {function} next
 */
exports.post = (req, res, next) => {
    const sendResponse = (user, created) => {
        const createdUser = user.get({ plain: true });
        // If no new users was created because it already exists.
        if (!created && createdUser) {
            return next(new Errors.UnprocessableEntityError({
                code: httpStatus.UNPROCESSABLE_ENTITY,
            }, 'User already exists'));
        }
        // The link where to find the new users or the existing one.
        res.header('Content-Location', `${req.route.path}/${createdUser.id}`);
        res.status(httpStatus.CREATED);
        return res.json(getUserDto.map(createdUser));
    };
    const user = postUserDto(req.body);
    // set user custom claims on FireBase
    userMySqlRepository
        .createUser(user)
        .spread(sendResponse)
        .catch(errors => errorController(errors, next));
    // set user data into the token
    // fireBaseService.setFireBaseUserClaims(user.email, {});
};

/**
 * Query database for using users id.
 * @param {Object} req
 * @param {Object} res
 * @param {function} next
 */
exports.getById = (req, res, next) => {
    const sendResponse = (user) => {
        const status = user ? httpStatus.OK : httpStatus.NOT_FOUND;
        res.status(status);
        if (status === httpStatus.NOT_FOUND) {
            return res.json();
        }
        return res.json(getUserDto.map(user));
    };
    userMySqlRepository
        .getUserById({ id: req.params.id, fields: req.params.fields })
        .then(sendResponse)
        .catch(errors => errorController(errors, next));
};

/**
 * Get all users form the database.
 * @param {object} req
 * @param {object} res
 * @param {function} next
 */
exports.get = (req, res, next) => {
    const sendResponse = (users) => {
        res.set({
            Link: helpers.paginationLinks(req, users.count, maxLimit),
            'X-Total-Count': users.count,
        });
        res.status(httpStatus.OK);
        res.json(userCollectionDto(users.rows));
    };
    userMySqlRepository
        .getAllUsers(req)
        .then(sendResponse)
        .catch(errors => errorController(errors, next));
};

/**
 * Update users data.
 * @param {Object} req
 * @param {Object} res
 * @param {function} next
 */
exports.put = async (req, res, next) => {
    const sendResponse = (updated) => {
        const status = updated[0] > 0
            ? httpStatus.NO_CONTENT
            : httpStatus.NOT_FOUND;
        res.status(status);
        res.json();
    };
    userMySqlRepository
        .updateUser(req.params.id, putUserDto(req.body))
        .then(sendResponse)
        .catch(errors => errorController(errors, next));
};

/**
 * Delete users from the database.
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
    userMySqlRepository
        .deleteUser(req.params.id)
        .then(sendResponse)
        .catch(errors => errorController(errors, next));
};

/**
 * Send a json representation of the swagger file.
 * @param {Object} req
 * @param {Object} res
 */
exports.docs = (req, res) => {
    const nativeObj = YAML.load(`${__dirname}/../../docs/users_swagger.yaml`);
    res.json(nativeObj);
};
