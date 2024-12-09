const { Sequelize } = require('sequelize');
const config = require('../config').development;

const sequelize = new Sequelize(config.database, config.username, config.password, {
  host: config.host,
  dialect: config.dialect,
});

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.User = require('./user')(sequelize, Sequelize.DataTypes);
db.Mandor = require('./mandor')(sequelize, Sequelize);
db.Survey = require('./survey')(sequelize, Sequelize.DataTypes);
db.Payment = require('./payment')(sequelize, Sequelize);

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});


module.exports = db;