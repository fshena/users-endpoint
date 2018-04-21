const userRoutes   = require('./src/routes/users');
const playerRoutes = require('./src/routes/players');

module.exports = (server) => {
    userRoutes(server);
    playerRoutes(server);
};
