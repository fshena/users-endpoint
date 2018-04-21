const objMapper = require('object-mapper');

/**
 * The User entity structure that will be returned in the response.
 * @param {Object} user
 * @param {Boolean} reverse
 * @return {*}
 */
const mapping = {
    id: 'id',
    uid: 'uid',
    username: 'username',
    birthday: 'birthday',
    first_name: 'firstName',
    last_name: 'lastName',
    email: 'email',
    avatar: 'avatar',
    role_id: 'roleId',
    is_active: 'isActive',
    'Player.height': 'height',
    'Player.weight': 'weight',
    created_at: 'createdAt',
    updated_at: 'updatedAt',
};

module.exports = {
    getMap: () => mapping,
    map: user => objMapper(user, mapping)
};
