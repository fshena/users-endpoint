const restifyErrors = require('restify-errors');
const httpStatus    = require('http-status-codes');

/**
 * Throw Restify errors
 * @param {object} errors
 * @param {function} next
 * @return {*}
 */
module.exports = (errors, next) => {
    if (errors) {
        return next(new restifyErrors.BadRequestError({
            code: httpStatus.BAD_REQUEST,
            message: errors.message,
        }));
    }
    return next();
};
