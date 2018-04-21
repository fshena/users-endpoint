const objMapper = require('object-mapper');

/**
 * The Player json structure needed for updating an entry.
 * @param {Object} player
 * @return {*}
 */
module.exports = (player) => {
    const src = {
        userId: 'user_id',
        height: 'height',
        weight: 'weight'
    };
    return objMapper(player, src);
};
