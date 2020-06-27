const mysql = require('mysql');
const pdfgen = require('../pdf/pdfgen.js');


// Configure a connection
const con = mysql.createConnection({
    host: '---',
    user: '---',
    password: '---',
    database: 'inventory'
})

artwork = function () {
    return new Promise((resolve, reject) => {
        con.query('select * from artwork order by 2 desc limit 10', (err, result) => {
            resolve(result);
        })
    })
}

artists = function () {
    return new Promise((resolve, reject) => {
        let _query = 'select * from artists';

        con.query(_query, (err, result) => {
            resolve(result);
        })
    })
}

prices = function (_artist) {
    return new Promise((resolve, reject) => {
        con.query('select price from artwork where artistId=?', [_artist], (err, result) => {
            if (err) console.log(err);

            resolve(result);
        })
    })
}

allTotals = function () {
    return new Promise((resolve, reject) => {
        let _query = 'select sum(price) as total, artistId from artwork group by artistId';

        con.query(_query, (err, result) => {
            if (err) console.error(err);

            resolve(result);
        })
    })
}

totalNumPerArtist = function () {
    return new Promise((resolve, reject) => {
        let _query = 'select count(artistId) as total, artistId from artwork group by artistId';

        con.query(_query, (err, result) => {
            if (err) console.error(err);

            resolve(result);
        })
    })
}

deleteEntry = function (_id) {
    return new Promise((resolve, reject) => {
        con.query('delete from artwork where id=?', [_id], (err, result) => {
            if (err) console.error(err);

            resolve(result);
        })
    })
}

newArtist = function (firstName, lastName) {
    return new Promise((resolve, reject) => {
        let _query = 'insert into artists (firstName, lastName) values (?, ?)';

        con.query(_query, [firstName, lastName], function (err, result) {
            if (err) console.error(err);

            resolve(result);
        })
    })
}

newEntry = function (prodId, prodTitle, prodPrice, consign, sculptHeight, width, artistId) {
    return new Promise((resolve, reject) => {
        let _query = 'insert into artwork(prodId, title, price, consign, sculptHeight, sulptWidth, artistId) values (?, ?, ?, ?, ?, ?, ?)';
        let _queryParams = [prodId, prodTitle, prodPrice, consign, sculptHeight, width, artistId];

        con.query(_query, _queryParams, function (err, result) {
            if (err) console.error(err);

            resolve(result);
        })
    })
}

artistPdf = function (artistId) {
    return new Promise((resolve, reject) => {
        let _query = 'select artwork.prodId, artwork.title, artwork.price, artists.firstName, artists.lastName from artwork join artists on artwork.artistId = artists.id where artwork.artistId=?';

        try {
            con.query(_query, [artistId], async function (err, result) {
                if (err) console.error(err);

                await pdfgen.createArtistPdf(result);

                resolve('PDF successfuly created.');
            })

        } catch (err) {
            console.error(err);
        }
    })
}

allwork = function (orderBy) {
    return new Promise((resolve, reject) => {
        let _query = `select artwork.prodId, artwork.title, artwork.price, artists.firstName, artists.lastName from artwork join artists on artwork.artistId = artists.id order by ${orderBy}`;

        try {
            con.query(_query, async function (err, result) {
                if (err) console.error(err);

                await pdfgen.createGalleryPdf(result);

                resolve('PDF successfully created.');
            })
        } catch (err) {
            console.error(err);
        }
    })
}

module.exports.con = con;
module.exports.artwork = artwork;
module.exports.artists = artists;
module.exports.prices = prices;
module.exports.allTotals = allTotals;
module.exports.totalNumPerArtist = totalNumPerArtist;
module.exports.deleteEntry = deleteEntry;
module.exports.newArtist = newArtist;
module.exports.newEntry = newEntry;
module.exports.artistPdf = artistPdf;
module.exports.allwork = allwork;
