const path = require('path');

const express = require('express');
const session = require('express-session')
const mongodbStoreRequire = require('connect-mongodb-session')

const db = require('./data/database');
const Routes = require('./routes/main');

const MongoDBStore = mongodbStoreRequire(session)

const app = express();

const sessionStore = new MongoDBStore({
  uri: 'mongodb://localhost:27017',
  databaseName: 'deep_control',
  collection: 'sessions'
})

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static('public'));
app.use(express.urlencoded({ extended: false }));

app.use(session({
  secret: 'e29fac41650c94216220a5b7d296cb53',
  resave: false,
  saveUninitialized: false,
  store: sessionStore,
  cookie: {
    maxAge: 24 * 30 * 60  * 60 * 1000
  }
}))

app.use(Routes);

app.use(function(error, req, res, next) {
  res.status(404).render('errors/404');
})

app.use(function(error, req, res, next) {
  res.status(500).render('errors/500');
})

db.connectToDatabase().then(function () {
  app.listen(8080);
});
