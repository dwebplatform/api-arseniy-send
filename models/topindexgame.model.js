
module.exports = (sequelize, Sequelize) => {
  const TopIndexGame = sequelize.define("topindexgames", {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true // Automatically gets converted to SERIAL for postgres
    },
    name: {
      type: Sequelize.TEXT,
    },
    isShowed: {
      type: Sequelize.BOOLEAN,
      defaultValue: false
    }
  },
  );

  return TopIndexGame;
};