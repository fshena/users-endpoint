const objMapper = require('object-mapper');

const mapping = {
    id: 'id',
    uid: 'uid',
    first_name: 'firstName',
    last_name: 'lastName',
    email: 'email',
    avatar: 'avatar',
    role_id: 'roleId',
    is_active: 'isActive',
    created_at: 'createdAt',
    updated_at: 'updatedAt',
};

/**
 * The User entity collection structure that
 * will be returned in the response.
 * @param  {Object[]} users
 * @return {*}
 */
module.exports = (users) => {
    const usersDto = users;
    usersDto.forEach((user, index) => {
        usersDto[index] = objMapper(user, mapping);
    });
    return usersDto;
};
