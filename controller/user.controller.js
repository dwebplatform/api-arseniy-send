
require('dotenv').config();
const { PolimorphContainer } = require('../polimorphs');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const db = require('../models');
const { use } = require('passport');
const User = db.users;

//TODO: check if user with those fields already exists
async function isUserExist(email, type) {
	let findedInstance = await User.findOne({
		where: {
			email: email,
			entity_type: type
		}
	});
	if (findedInstance instanceof User) {
		return true;
	}
	return false;
}

async function createUser(email, login, timeZone, password, type, res) {
	let newUserEntity = await User.create({
		email,
		login,
		password,
	});
	// Player or Coach
	let newEntity = await PolimorphContainer[type].create({
		login: login,
		timeZone: timeZone
	});
	newUserEntity.entity_id = newEntity.id;
	newUserEntity.entity_type = type;
	const secretKey = process.env.JWT_SECRET_KEY;
	const jwtObject = {
		id: newUserEntity.id,
		type: newUserEntity.entity_type
	};
	const token = jwt.sign(jwtObject, secretKey, {});
	await newUserEntity.save();
	return res.json({
		status: 'ok',
		token,
	});
}


exports.login = async (req, res) => {
	const { field_type, field_value, password, type } = req.body;
	// передастся поле email или login
	let user;
	try {
		user = await getUserForLogin(password, field_type, field_value, type, res);
		if (!user) {
			return res.json({
				status: 'error',
				msg: 'не удалось найти такого пользователя'
			})
		}
	} catch (e) {
		return res.json({
			status: 'error',
			msg: 'не удалось найти такого пользователя'
		});
	}
	try {
		sendToken(password, user, res);
	} catch (e) {
		return res.json({
			status: 'error',
			msg: 'что-то пошло не так'
		});
	}
}
exports.register = async (req, res) => {
	let { login, email, timeZone, password, type } = req.body;
	if (!email || !login) {
		return res.json({
			status: 'error',
			msg: 'не был передан логин или email'
		});
	}
	if (!email || !password || !timeZone) {
		return res.json({
			status: 'error',
			msg: 'Не все поля были заполнены'
		});
	}
	if (!(type in PolimorphContainer)) {
		return res.json({
			status: 'error',
			msg: 'неопознанный тип пользователя'
		});
	}
	if (await isUserExist(email, type)) {
		return res.json({
			status: 'error',
			msg: 'user already exist'
		});
	}
	try {
		createUser(email, login, timeZone, password, type, res);
	} catch (e) {
		return res.json({
			status: 'error',
			msg: 'не удалось зарегестрировать нового пользователя'
		});
	}
}
async function sendToken(password, user, res) {
	bcrypt.compare(password, user.password, function (err, result) {
		if (err) {
			return res.json({
				status: 'error',
				msg: 'не удалось найти такого пользователя'
			});
		}
		if (result) {
			const secretKey = process.env.JWT_SECRET_KEY;
			const jwtObject = {
				id: user.id,
				type: user.entity_type
			};
			const token = jwt.sign(jwtObject, secretKey, {});
			return res.json({
				status: 'ok',
				token
			});
		}
		return res.json({
			status: 'error',
			msg: 'не удалось найти такого пользователя'
		})
	})
}
async function getUserForLogin(password, field_type, field_value, type, res) {
	if (!(type in PolimorphContainer)) {
		return false;
	}
	if (!field_type || !field_value || !password || !type) {
		return false;
	}
	let user;
	try {
		user = await User.findOne({
			where: { [field_type]: field_value }
		});
	} catch (e) {
		return false;
	}
	if (!user) {
		return false;
	}
	return user;
}
