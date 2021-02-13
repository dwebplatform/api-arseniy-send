
module.exports = (sequelize, Sequelize) => {
  const CoachAndGame = sequelize.define("coachandgames", {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true // Automatically gets converted to SERIAL for postgres
    },
    gameId: {
      type: Sequelize.INTEGER
    },
    coachId: {
      type: Sequelize.INTEGER
    }

  },
  );

  return CoachAndGame;
};