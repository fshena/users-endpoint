const server = require('@localleague/server');

require('./src/routes/users')(server);
require('./src/routes/players')(server);

module.exports = server;
