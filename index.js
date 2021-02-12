const bodyParser = require('body-parser')
const express = require('express');
const jwt = require('jsonwebtoken');
const app = express()
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }))
const passport = require('passport');
const { PolimorphContainer } = require('./polimorphs');
const db = require("./models");
require('dotenv').config();

db.sequelize.sync().catch((e) => {
    console.log(e);
});

app.use(passport.initialize());
require('./config/passport.config')(passport);

const User = db.users;
app.get('/protected', passport.authenticate('jwt', { session: false }), (req, res) => {
    return res.json({
        status: 'ok',
        user: req.user,
        msg: 'protected'
    });
});



require('./routes/user.routes')(app);

// app.post('/register', async (req, res) => {
//     let { email, password, type } = req.body;
//     if (!email || !password) {
//         return res.json({
//             status: 'error',
//             msg: 'Not every field were passed'
//         });
//     }
//     if (!(type in PolimorphContainer)) {
//         return res.json({
//             status: 'error',
//             msg: 'unrecognized user type'
//         });
//     }
//TODO: check if user with those fields already exists
//     let findedInstance = await PolimorphContainer[type].findOne({
//         where: {
//             name: email
//         }
//     });
//     if (findedInstance instanceof PolimorphContainer[type]) {
//         return res.json({
//             status: 'error',
//             msg: 'this user is already exist'
//         });
//     }
//     try {
//         let newUserEntity = await User.create({
//             email,
//             password
//         });
//         // Player or Coach
//         let newEntity = await PolimorphContainer[type].create({
//             name: email,
//         });
//         newUserEntity.entity_id = newEntity.id;
//         newUserEntity.entity_type = type;
//         const secretKey = process.env.JWT_SECRET_KEY;
//         const jwtObject = {
//             id: newUserEntity.id,
//             type: newUserEntity.entity_type
//         };
//         const token = jwt.sign(jwtObject, secretKey, {});
//         await newUserEntity.save();
//         return res.json({
//             status: 'ok',
//             token,
//             createdEntity: newUserEntity
//         });
//     } catch (e) {
//         console.log({ ERROR: e })
//         return res.json({
//             status: 'error'
//         });
//     }


// });
module.exports = {
    path: '/api',
    handler: app
}