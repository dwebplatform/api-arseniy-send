
require('dotenv').config();
const { PolimorphContainer } = require('../polimorphs');
const jwt = require('jsonwebtoken');
const db = require('../models');
const User = db.users;


//TODO: check if user with those fields already exists
async function isUserExist(email, type) {
    let findedInstance = await PolimorphContainer[type].findOne({
        where: {
            name: email
        }
    });
    if (findedInstance instanceof PolimorphContainer[type]) {
        return true;
    }
    return false;
}

async function createUser(email, password, type, res) {
    let newUserEntity = await User.create({
        email,
        password
    });
    // Player or Coach
    let newEntity = await PolimorphContainer[type].create({
        name: email,
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
        createdEntity: newUserEntity
    });
}
exports.register = async (req, res) => {
    let { email, password, type } = req.body;
    if (!email || !password) {
        return res.json({
            status: 'error',
            msg: 'Not every field were passed'
        });
    }
    if (!(type in PolimorphContainer)) {
        return res.json({
            status: 'error',
            msg: 'unrecognized user type'
        });
    }

    if (await isUserExist(email, type)) {
        return res.json({
            status: 'error',
            msg: 'user already exist'
        });
    }
    try {
        createUser(email, password, type, res);
    } catch (e) {
        console.log({ ERROR: e })
        return res.json({
            status: 'error'
        });
    }

}

