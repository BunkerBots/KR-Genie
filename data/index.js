const emotes = require('./JSON/emotes.json'),
    developers = require('./JSON/dev.json'),
    crime = require('./JSON/crime.json'),
    work = require('./JSON/work.json'),
    beg = require('./JSON/beg.json'),
    core = require('./JSON/core.json'),
    betaTesters = require('./JSON/betaTesters.json'),
    profileSchema = require('../schemas/profile-schema'),
    economy = require('../scripts/economy');

module.exports = { emotes, profileSchema, economy, crime, work, beg, developers, core, betaTesters };
