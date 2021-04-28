const market = require('../data/JSON/market.json').items;
module.exports = [
    { name: 'Slick\'s American Flag', id: 0, icon: `${market.slick.icon}`, price: `${market.slick.price}`, type: 'c', description: `${market.slick.description}` },
    { name: 'Asokra\'s Trophy Case', id: 1, icon: `${market.asokra.icon}`, price: `${market.asokra.price}`, type: 'c', description: `${market.asokra.description}` },
    { name: 'Koma\'s Green Penguin of Doom', id: 2, icon: `${market.koma.icon}`, price: `${market.koma.price}`, type: 'c', description: `${market.koma.description}` },
    { name: 'KS\'s Lambo', id: 3, icon: `${market.ks.icon}`, price: `${market.ks.price}`, type: 'c', description: `${market.ks.description}` },
    { name: 'Jytesh\'s Chewed Pen', id: 4, icon: `${market.jytesh.icon}`, price: `${market.jytesh.price}`, type: 'c', description: `${market.jytesh.description}` },
    { name: 'Earish\'s Sword', id: 5, icon: `${market.earish.icon}`, price: `${market.earish.price}`, type: 'c', description: `${market.earish.description}` },
    { name: 'Disney\'s Orca', id: 6, icon: `${market.disney.icon}`, price: `${market.disney.price}`, type: 'c', description: `${market.disney.description}` },
    { name: 'Jon\'s Inner Eye', id: 7, icon: `${market.jon.icon}`, price: `${market.jon.price}`, type: 'c', description: `${market.jon.description}` },
    { name: 'Fuderal\'s Router', id: 8, icon: `${market.fuderal.icon}`, price: `${market.fuderal.price}`, type: 'c', description: `${market.fuderal.description}` },
    { name: 'Jypa\'s Jeep', id: 9, icon: `${market.jypa.icon}`, price: `${market.jypa.price}`, type: 'c', description: `${market.jypa.description}` },
];

module.exports.items = [
    { name: 'Padlock', id: 0, icon: `${market.padlock.icon}`, price: `${market.padlock.price}`, type: 'i', index: 1, description: `${market.padlock.description}` },
    { name: 'Premium', id: 1, icon: `${market.premium.icon}`, price: `${market.premium.price}`, type: 'b', description: `${market.premium.description}` },
    { name: 'Face Mask', id: 2, icon: `${market['face-mask'].icon}`, price: `${market['face-mask'].price}`, type: 's', index: 944, description: `${market['face-mask'].description}` },
    { name: 'Antidote xvi', id: 3, icon: `${market.antidote.icon}`, price: `${market.antidote.price}`, type: 's', index: 1659, description: `${market.antidote.description}` },
];
