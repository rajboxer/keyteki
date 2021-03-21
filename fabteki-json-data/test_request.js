// JavaScript source code

const https = require('https');
const request = require('request');
const fs = require('fs');
const mkdirp = require('mkdirp');
const path = require('path');

let sets = ['WTR', 'ARC', 'CRU'];

const options = {
    hostname: 'api.fabdb.net',
    method: 'GET',
    //path: '/decks/WxZlxVwN'
    path: '/cards/ARC030'
};

function apiRequest(path) {
    console.log(path);
    const apiUrl = 'https://api.fabdb.net';
    //let obj = request.get(apiUrl + path)
    options.path = path;
    //return request.get(obj.uri.href)

    return new Promise((resolve, reject) => {
        req = https.get(options, (res) => {
            let error = res.statusCode;

            if (error != 200) {
                console.log('error!!!!!!');
                return reject(error);
            }

            res.on('data', (d) => {
                const obj = JSON.parse(d);
                resolve(obj);
            });
        });
    });
}

function fetchImage(url, id, imagePath, timeout) {
    setTimeout(function () {
        console.log('Downloading image for ' + id);
        request(url).pipe(fs.createWriteStream(imagePath));
    }, timeout);
}
let card = path.join('/cards', process.argv[2]).replace(/\\/g, '/');
let fetchCards = apiRequest(card).then((card) => {
    //console.log(card)
    card.class = card.keywords[0];
    if (card.keywords.includes('weapon')) {
        card.type = 'weapon';
        card.pitch = 0;
    } else if (card.keywords.includes('hero')) {
        card.type = 'hero';
        card.blitz = false;
        if (card.keywords.includes('young')) {
            card.blitz = true;
        }
    } else if (card.keywords.includes('equipment')) {
        card.type = 'equipment';
        card.location = card.keywords[2];
    } else {
        card.pitch = Number(card.stats.resource);
        card.cost = Number(card.stats.cost);
        card.attack = Number(card.stats.attack);
        card.defense = Number(card.stats.defense);
        card.type = card.keywords[1]; // action, defense
        if (card.type != 'instant') {
            card.subtype = card.keywords[2]; //attack, reaction, item
        } else {
            card.subtype = 'None';
        }
    }

    console.log(card);
    let imageDir = path.join(__dirname, '..', '..', 'public', 'img', 'cards');
    mkdirp(imageDir);

    let jsonDir = path.join(__dirname, 'sets');
});
/*
const req = https.request(options, res => {
    //console.log('statusCode: ${res.statusCode}')
    res.on('data', d => {
        //process.stdout.write(d)
        const obj = JSON.parse(d)
        //console.log(obj)
        console.log(obj["name"])
        obj.name = 'Raj'
        obj.food = 'bananas'
        console.log(obj)
    })
})

req.on('error', error => {
    console.error(error)
})

req.end()
*/

/*

const request = require('request');
const monk = require('monk');
const fs = require('fs');
const mkdirp = require('mkdirp');
const path = require('path');

const CardService = require('../services/CardService.js');

function apiRequest(path) {
    const apiUrl = 'https://api.fiveringsdb.com/';

    return new Promise((resolve, reject) => {
        request.get(apiUrl + path, function (error, res, body) {
            if (error) {
                return reject(error);
            }

            resolve(JSON.parse(body));
        });
    });
}

function fetchImage(url, id, imagePath, timeout) {
    setTimeout(function () {
        console.log('Downloading image for ' + id);
        request(url).pipe(fs.createWriteStream(imagePath));
    }, timeout);
}

let db = monk('mongodb://127.0.0.1:27017/ringteki');
let cardService = new CardService(db);

let fetchCards = apiRequest('cards')
    .then(cards => cardService.replaceCards(cards.records))
    .then(cards => {
        console.info(cards.length + ' cards fetched');

        let imageDir = path.join(__dirname, '..', '..', 'public', 'img', 'cards');
        mkdirp(imageDir);

        var i = 0;

        cards.forEach(function (card) {
            if (card.pack_cards.length > 0) {
                var imagePath = path.join(imageDir, card.id + '.jpg');
                let firstCardWithImageUrl = card.pack_cards.find(card => card.image_url);
                if (firstCardWithImageUrl) {
                    let imageSrc = firstCardWithImageUrl.image_url;
                    if (imageSrc && !fs.existsSync(imagePath)) {
                        fetchImage(imageSrc, card.id, imagePath, i++ * 200);
                    }
                }
            }
        });

        return cards;
    })
    .catch(() => {
        console.error('Unable to fetch cards');
    });

let fetchPacks = apiRequest('packs')
    .then(packs => cardService.replacePacks(packs.records))
    .then(packs => {
        console.info(packs.length + ' packs fetched');
    })
    .catch(() => {
        console.error('Unable to fetch packs');
    });

Promise.all([fetchCards, fetchPacks])
    .then(() => db.close())
    .catch(() => db.close());

*/
