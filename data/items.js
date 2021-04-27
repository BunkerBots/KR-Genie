const market = require('../data/JSON/market.json').items;
module.exports = [
    { name: 'Slick\'s American Flag', id: 0, icon: `${market.slick.icon}`, price: `${market.slick.price}`, type: 'c' },
    { name: 'Asokra\'s Trophy Case', id: 1, icon: `${market.asokra.icon}`, price: `${market.asokra.price}`, type: 'c' },
    { name: 'Koma\'s Green Penguin of Doom', id: 2, icon: `${market.koma.icon}`, price: `${market.koma.price}`, type: 'c' },
    { name: 'KS\'s Lambo', id: 3, icon: `${market.ks.icon}`, price: `${market.ks.price}`, type: 'c' },
    { name: 'Jytesh\'s Chewed Pen', id: 4, icon: `${market.jytesh.icon}`, price: `${market.jytesh.price}`, type: 'c' },
    { name: 'Earish\'s Sword', id: 5, icon: `${market.earish.icon}`, price: `${market.earish.price}`, type: 'c' },
    { name: 'Disney\'s Orca', id: 6, icon: `${market.disney.icon}`, price: `${market.disney.price}`, type: 'c' },
    { name: 'Jon\'s Inner Eye', id: 7, icon: `${market.jon.icon}`, price: `${market.jon.price}`, type: 'c' },
    { name: 'Premium', id: 8, icon: `${market.premium.icon}`, price: `${market.premium.price}`, type: 'b' },
    { name: 'Face Mask', id: 9, icon: `${market['face-mask'].icon}`, price: `${market['face-mask'].price}`, type: 's', index: 944 },
    { name: 'Antidote xvi', id: 10, icon: `${market.antidote.icon}`, price: `${market.antidote.price}`, type: 's', index: 1659 }];
