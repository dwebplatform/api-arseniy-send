const bodyParser = require('body-parser')
const express = require('express');
const jwt = require('jsonwebtoken');
const app = express()
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }))
const passport = require('passport');
const { PolimorphContainer } = require('./polimorphs');
const db = require("./models");
const Coach = db.coachs;
const Game = db.games;
const TopIndexGame = db.topindexgames;
const CoachGame = db.coachgames;
require('dotenv').config();

db.sequelize.sync().catch((e) => {
	console.log(e);
});


/**relations between model */
Coach.belongsToMany(Game, { through: CoachGame });
Game.belongsToMany(Coach, { through: CoachGame });
app.use(passport.initialize());
Game.hasOne(TopIndexGame);
require('./config/passport.config')(passport);

const User = db.users;
app.get('/test', async (req, res) => {
	return res.json({
		users: await User.findAll()
	})
})
app.get('/protected', passport.authenticate('jwt', { session: false }), (req, res) => {
	return res.json({
		status: 'ok',
		user: req.user,
		msg: 'protected'
	});
});



require('./routes/user.routes')(app);
require('./routes/player.routes')(app);
module.exports = {
	path: '/api',
	handler: app
}