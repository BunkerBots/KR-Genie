const emotes = require('../JSON/emotes.json'),
    profileSchema = require('../schemas/profile-schema'),
    economy = require('../scripts/economy'),
    crime = require('../commands/economy/JSON/crime.json'),
    work = require('../commands/economy/JSON/work.json'),
    beg = require('../commands/economy/JSON/beg.json'),
    developers = require('../JSON/dev.json'),
    core = require('../JSON/core.json'),
    betaTesters = require('../JSON/betaTesters.json')

module.exports = {emotes , profileSchema , economy , crime , work , beg , developers , core , betaTesters}