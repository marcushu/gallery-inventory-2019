const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const db = require('./database');

const app = express();
const port = 3000;

app.use(cors());

var jsonParser = bodyParser.json();


/*
 *  Return all artist
 */
app.get('/artists', (req, res) => {
    db.artists().then(result => {
        res.send(result);
    })
})

/*
 *  Return the last x# of created entries.  
 */
app.get('/artwork', (req, res) => {
    db.artwork().then(result => {
        res.send(result);
    })
})

/*
 *  Return pricing for an anrtist
 */
app.post('/prices', jsonParser, (req, res) => {
    db.prices(req.body.artistId).then(result => {
        res.send(result);
    })
})

/*
 * Return cumuliative pricing for each artist
 */
app.get('/allTotals', jsonParser, (req, res) => {
    db.allTotals().then(result => {
        res.send(result);
    })
})

/*
 *  Return the total number of works per artist
 */
app.get('/totalNumPerArtist', (req, res) => {
    db.totalNumPerArtist().then(result => {
        res.send(result);
    })
})

/*
 *  Delete an entry
 */
app.post('/deleteEntry', jsonParser, (req, res) => {
    db.deleteEntry(req.body.idToDelete).then(result => {
        res.send(result);
    })
})

/*
 *  Create a new-artist entry in db.
 */
app.post('/newArtist', jsonParser, (req, res) => {
    db.newArtist(req.body.firstName, req.body.lastName).then(result => {
        res.send(result);
    })
})

/*
 *  Insert new inventory item
 */
app.post('/newEntry', jsonParser, (req, res) => {
    db.newEntry(req.body.prodId, req.body.prodTitle, req.body.prodPrice, req.body.consign, req.body.sculptHeight, req.body.width, req.body.artistId).then(result => {
        res.send(result);
    })
})

/*
 *  Print artist's info to .pdf
 */
app.post('/artistpdf', jsonParser, (req, res) => {
    db.artistPdf(req.body.artistId).then(result => {
        res.send(result);
    })
})

/*
 *  Create a pdf of the complete inventory
 */
app.post('/allWork', jsonParser, (req, res) => {
    db.allwork(req.body.orderBy).then( result => {
        res.send(result);
    })
})


app.listen(port, () => { console.log(`Listening on port ${port}.`) });
