////////////////////////////////////LIBRARIES////////////////////////////////////
require('dotenv').config()
const express = require('express')
const hbs = require('express-handlebars')
const mysql = require("mysql") 

////////////////////////////////////METHODS////////////////////////////////////
//express
const app = express()

//handlebars
app.engine('handlebars', hbs({ defaultLayout: 'index'}))
app.set('view engine', 'handlebars')

//sql
const sqlFindAllFilms = "SELECT film_id, title FROM film LIMIT 50"
const sqlfindFilmbyId = "SELECT film_id, title FROM film WHERE film_id=?"
var pool = mysql.createPool ({ 
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  connectionLimit: process.env.DB_CONLIMIT
})

//promise for sql query
var makeQuery = (sql, pool) => {
  console.info('sql >>>>> ', sql)
  return (args) => {
    let queryPromise = new Promise ((resolve, reject) => {
      pool.getConnection ((err, connection) => {
        if (err) {
          reject (err)
          return
        }
        console.info('args >>>>> ', args)
        connection.query(sql, args || [], (err, results) => {
          if (err) {
            reject (err)
            return
          }
          // console.info('results >>>>> ', results)
          resolve(results)
        })
      })
    })
    return queryPromise
  }
}

//var turned into promise when makeQuery executes
var findAllFilms = makeQuery(sqlFindAllFilms, pool)
var findFilmbyId = makeQuery(sqlfindFilmbyId, pool)

////////////////////////////////////ROUTES////////////////////////////////////
//GET one film by Id (params)
app.get('/films/:filmId', (req, res) => {
  console.info('params >>>>>', req.params);
  findFilmbyId([parseInt(req.params.filmId)]).then ((results) => {
    res.json(results)
  }).catch((error) => {
    console.info(error)
    res.status(500).json(error)
  })
})

//GET one film by Id (querystring) or all films if there is no querystring
app.get('/films', (req, res) => {
  console.info('query >>>>>', req.query)
  console.info('query.filmId >>>>>', req.query.filmId)
  if(typeof(req.query.filmId) === 'undefined'){
    findAllFilms().then ((results) => {
      let finalResult = []
      results.forEach((element) => {
        let value = { title: "", url: null }
        value.title = element.title
        value.url = `/films/${element.film_id}`
        finalResult.push(value)
        // finalResult.push({ title: element.title, url: `/films/${element.film_id}` })
      })
      res.json(finalResult)
    }).catch((error) => {
      console.info(error)
      res.status(500).json(error)
    })
  }
  else {
    findFilmbyId([parseInt(req.query.filmId)]).then ((results) => {
      res.json(results)
    }).catch((error) => {
      console.info(error)
      res.status(500).json(error)
    })
  }
})

////////////////////////////////////LISTEN////////////////////////////////////
const PORT = parseInt(process.argv[2]) || parseInt(process.env.APP_PORT) || 3000
app.listen(PORT, () => {
  console.info(`Application started on port ${PORT} on ${new Date()}`)
})