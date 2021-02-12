const bcrypt = require('bcryptjs');

async function hashPassword(user) {
    const password = user.password
    const saltRounds = 10;
    const hashedPassword = await new Promise((resolve, reject) => {
        bcrypt.hash(password, saltRounds, function (err, hash) {
            if (err) reject(err)
            resolve(hash)
        });
    })
    return hashedPassword;
}
module.exports = (sequelize, Sequelize) => {
    const User = sequelize.define("users", {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true // Automatically gets converted to SERIAL for postgres
        },
        password: {
            type: Sequelize.STRING,
        },
        entity_id: {
            type: Sequelize.INTEGER
        },
        entity_type: {
            type: Sequelize.ENUM('coach', 'player')
        },
        email: {
            type: Sequelize.STRING
        },
    },
    );

    User.beforeCreate(async user => {
        user.password = await hashPassword(user);
    });
    return User;
};