const express = require('express')
const Datastore = require('nedb') 
const db = new Datastore({ filename: '.data/datafile', autoload: true })
const app = express()

app.use(express.static('public'))

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html')
})

// Creates a route that returns a list of all quotes
app.get('/quotes', (req, res) => {
  var allQuotes = []
  db.find({}, (err, quotes) => {
    quotes.forEach(quote => {
      allQuotes.push({
        body: quote.body,
        source: quote.source,
        link: quote.link,
        time: quote.time,
        quoteId: quote._id
      })
    })
    res.send(allQuotes)
  })
})

// Creates a new entry in the quotes collection with the submitted values
app.post('/quotes', (req, res) => {
  db.insert(req.query, (err, quoteInserted) => {
    if (err) console.error(err)
    else if (quoteInserted) console.log('New quote inserted.')
  })
  res.sendStatus(200)
})

// Deletes a quote
app.post('/delete', (req, res) => {
  db.remove({ _id: req.query.quoteId }, (err, quoteRemoved) => {
    if (err) console.error(err)
    else if (quoteRemoved) console.log('New quote inserted.')
  })
  res.sendStatus(200)
})

// Removes everything from the db and inserts defaults
app.get('/restore', (req, res) => {
  db.remove({}, { multi: true }, err => {
    if (err) console.log(err)
    else console.log('Database cleared.')
  })
  db.insert(fixtures, (err, quotesAdded) => {
    if (err) console.log(err)
    else if (quotesAdded) console.log('Default quotes inserted.')
  })
  res.sendStatus(200)
})

// Default Data
let fixtures = [
  { 
    "body": "It was my experience that people approached an online purchase of six dollars with the same deliberation and thoughtfulness they might bring to bear when buying a new car. Prospective users would hand-wring for weeks on Twitter and send us closely-worded, punctilious lists of questions before creating an account.",
    "source": "Maciej Cegłowski",
    "link": "https://blog.pinboard.in/2011/03/anatomy_of_a_crushing",
    "time": "1496702624599"
  },
  { 
    "body": "Be yourself; everyone else is already taken.",
    "source": "Oscar Wilde",
    "link": "https://www.goodreads.com/author/show/3565.Oscar_Wilde",
    "time": "1496702654029"
  },
  { 
    "body": "Two things are infinite: the universe and human stupidity; and I'm not sure about the universe.",
    "source": "Albert Einstein",
    "link": "https://www.goodreads.com/author/show/9810.Albert_Einstein",
    "time": "1496702656504"
  }
]

app.listen(process.env.PORT)