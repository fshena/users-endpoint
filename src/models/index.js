const { db } = require('@localleague/database');

const models = [];

models.push(require('./user-model'));
models.push(require('./player-model'));

module.exports = db.loadModels(models);
