

const db = require('../models');

const PolimorphContainer = {
    'player': db.players,
    'coach': db.coachs,
}
module.exports = {
    PolimorphContainer
}