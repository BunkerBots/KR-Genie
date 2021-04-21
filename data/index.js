const emotes = require('./JSON/emotes.json'),
    devs = require('./JSON/dev.json'),
    crime = require('./JSON/crime.json'),
    work = require('./JSON/work.json'),
    beg = require('./JSON/beg.json'),
    core = require('./JSON/core.json'),
    testers = require('./JSON/betaTesters.json'),
    id = require('./JSON/id.json'),
    profileSchema = require('../schemas/profile-schema'),
    economy = require('../scripts/economy');

module.exports = { emotes, profileSchema, economy, crime, work, beg, devs, core, testers, id };
