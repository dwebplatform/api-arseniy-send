require('dotenv').config();
const db = require("../models");
const User = db.users;
// import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt'
const { Strategy: JwtStrategy, ExtractJwt } = require('passport-jwt');

const opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = process.env.SECRET_OR_KEY || 'kitty_mitty';
opts.passReqToCallback = true;

const { PolimorphContainer } = require('../polimorphs');
// opts.issuer = 'accounts.examplesoft.com';
// opts.audience = 'yoursite.net';
// create jwt strategy 
module.exports = passport => {
  passport.use(
    new JwtStrategy(opts, (req, jwt_payload, done) => {
      userFireWall(req, jwt_payload, done);
    })
  );
};
async function userFireWall(req, jwt_payload, done) {
  let findedUser = await User.findOne({
    where: {
      id: jwt_payload.id
    }
  }).catch((e) => {
    done(null, false)
  });
  if (findedUser) {
    try {
      req.user = await PolimorphContainer[jwt_payload.type].findOne({
        where: {
          id: findedUser.entity_id
        }
      });
      return done(null, req.user);
    } catch (e) {
      return done(null, false)
    }
  } else {
    return done(null, false)
  }
}
