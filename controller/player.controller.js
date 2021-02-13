
const db = require('../models');
const Game = db.games;
const Coach = db.coachs;
const TopIndexGame = db.topindexgames;
const paginate = require('express-paginate');
const { Op } = require('sequelize');
async function getGameCorrespondeToTopIndexGame({ gameId }) {
  try {
    let game = await Game.findOne({
      where: { id: gameId }
    });
    return game;
  } catch (e) {
    return null;
  }
}
exports.getTopGames = async (req, res) => {
  const filterObjectShowedAndNotNullableGames = {
    where: {
      [Op.and]: {
        isShowed: true,
        [Op.not]: {
          gameId: null
        }
      }
    }
  }
  let topTenGames = await TopIndexGame.findAll(filterObjectShowedAndNotNullableGames);
  if (!topTenGames) {
    return res.json({
      status: 'error',
      msg: 'список отображаемых топ игр  пуст'
    });
  }
  let games = await Promise.all(topTenGames.map(getGameCorrespondeToTopIndexGame));
  // возвращаем только не null объекты
  games = games.filter((item) => item !== null);
  if (games && games.length) {
    return res.json({
      status: 'ok',
      topgames: games
    })
  } else {
    return res.json({
      status: 'error',
      msg: 'список топ игр пуст'
    });
  }
};

exports.getGamesWithPaggination = async (req, res) => {
  let coach = await Coach.findOne({
    where: {
      id: 1
    },
    include: {
      model: Game
    }
  });
  const game = await Game.findOne({
    where: {
      id: 1
    }
  });
  await coach.addGame(game);
  return res.json(coach);
  let games = await Game.findAndCountAll({ limit: req.query.limit, offset: req.skip })
  const itemCount = games.count;
  const pageCount = Math.ceil(games.count / req.query.limit);
  return res.json({
    status: 'ok',
    games: games.rows,
    pageCount,
    itemCount,
    pages: paginate.getArrayPages(req)(3, pageCount, req.query.page)
  });
}