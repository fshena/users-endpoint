const objMapper = require('object-mapper');

/**
 * The User entity structure that will be returned in the response.
 * @param {Object} user
 * @return {*}
 */
module.exports = (user) => {
    const src = {
        username: 'username',
        birthday: 'birthday',
        firstName: 'first_name',
        lastName: 'last_name',
        avatar: 'avatar',
        roleId: 'role_id',
        isActive: 'is_active'
    };
    return objMapper(user, src);
};
