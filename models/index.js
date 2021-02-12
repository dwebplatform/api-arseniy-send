const dbConfig = require("../config/db.config.js");
const filepaths = require('filepaths');
const Sequelize = require("sequelize");
const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
    host: dbConfig.HOST,
    dialect: dbConfig.dialect,
    operatorsAliases: false,

});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;
let routes = filepaths.getSync('./api/models');
// db.users = require("./user.model.js")(sequelize, Sequelize);
for (let path of routes) {// перебор по роутам, чтобы не нужно было писать require('./testModel.model.js")(sequelize,Sequelize);
    let [main, sub] = path.split('\\');
    if (sub.includes('index')) {
        continue;
    } else {
        let [name, model, ext] = sub.split('.');
        db[`${name}s`] = require(`./${name}.${model}.${ext}`)(sequelize, Sequelize);
    }
}

module.exports = db;