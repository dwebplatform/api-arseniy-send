
module.exports = (sequelize, Sequelize) => {
  const Game = sequelize.define("games", {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true // Automatically gets converted to SERIAL for postgres
    },
    name: {
      type: Sequelize.TEXT,
    },

  },
  );

  return Game;
};