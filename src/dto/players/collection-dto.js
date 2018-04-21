const getPlayerDto = require('./get-dto');

/**
 * The Player entity collection structure that
 * will be returned in the response.
 * @param {Object[]} players
 * @return {*}
 */
module.exports = (players) => {
    const playersDto = [];
    players.forEach((player, index) => {
        playersDto[index] = getPlayerDto.map(player);
    });
    return playersDto;
};
