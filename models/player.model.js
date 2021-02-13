
module.exports = (sequelize, Sequelize) => {
	const Coach = sequelize.define("players", {
		id: {
			type: Sequelize.INTEGER,
			primaryKey: true,
			autoIncrement: true // Automatically gets converted to SERIAL for postgres
		},
		name: {
			type: Sequelize.TEXT,
		},
		login: {
			type: Sequelize.TEXT,
		},
		timeZone: {
			type: Sequelize.TEXT
		}

	},
	);

	return Coach;
};