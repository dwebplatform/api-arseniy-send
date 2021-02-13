
require('dotenv').config();
const paginate = require('express-paginate');
module.exports = (app) => {
  const playerController = require('../controller/player.controller');
  let router = require("express").Router();
  router.get('/top-games', playerController.getTopGames);
  router.get('/games', paginate.middleware(10, 50), playerController.getGamesWithPaggination);
  app.use('/players', router);
};
