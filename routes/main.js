const express = require('express');
const bcrypt = require('bcryptjs')

const db = require('../data/database');

const router = express.Router();

router.get('/', function (req, res) {
  res.render('index', { isAuth: req.session.isAuthenticated });
});

router.get('/signin', function (req, res) {
  if(req.session.isAuthenticated){
    return res.redirect('/')
  }
  res.render('signin', {errorMessage: null, isAuth: req.session.isAuthenticated});
});

router.get('/login', function (req, res) {
  if(req.session.isAuthenticated){
    return res.redirect('/')
  }
  res.render('login', {errorMessage: null, isAuth: req.session.isAuthenticated});
});

router.post('/signin', async function (req, res) {
  const userData = req.body;
  const userFullName = userData.name;
  const enteredEmail = userData.email;
  const enteredPassword = userData.password;
  const enteredConfirmPassword = userData.confirmPassword;
  
  if(!enteredEmail || 
    !enteredConfirmPassword || 
    !enteredPassword ||  
    !enteredEmail.includes('@')
    ) {
      return res.render('signin', {errorMessage: 'Tüm alanlar zorunludur', isAuth: req.session.isAuthenticated})
    }
     
    if(enteredPassword !== enteredConfirmPassword){
      return res.render('signin', {errorMessage: 'Şifreler eşleşmiyor', isAuth: req.session.isAuthenticated})
    }

  const existingUser = await db.getDb()
  .collection('users')
  .findOne({email:enteredEmail})

  if(existingUser){
    return res.render('signin', {errorMessage: 'E-posta adresi zaten kayıtlı', isAuth: req.session.isAuthenticated})
  }

  const hashedPassword = await bcrypt.hash(enteredPassword, 12)

  const user = {
    email: enteredEmail,
    password: hashedPassword
  }

   await db.getDb().collection('users').insertOne(user)

  res.redirect('/login');
});

router.post('/login', async function (req, res) {
  const userData = req.body;
  const enteredEmail = userData.email;
  const enteredPassword = userData.password;
  
  const existingUser = await db.getDb()
  .collection('users')
  .findOne({email: enteredEmail});
  if(!existingUser) {
    return res.render('login', {errorMessage: 'Kullanıcı adınız veya şifreniz yanlış', isAuth: req.session.isAuthenticated})
  }

  const passwordsMatches = await bcrypt.compare(enteredPassword, existingUser.password)

 if(!passwordsMatches){
  return res.render('login', {errorMessage: 'Kullanıcı adınız veya şifreniz yanlış', isAuth: req.session.isAuthenticated})
 }

 req.session.user = { id: existingUser._id, email: existingUser.email }
 req.session.isAuthenticated = true;
 req.session.save(function(){
   res.redirect('/harita')
 })
});

router.get('/harita', function (req, res) {
  if(!req.session.isAuthenticated || !req.session.user){
    return res.status(401).render('errors/401', { isAuth: req.session.isAuthenticated })
  }
  res.render('harita', { isAuth: req.session.isAuthenticated});
});

router.post('/logout', function (req, res) {
  req.session.user = null;
  req.session.isAuthenticated = false
  req.session.save(function(){
    res.redirect('/')
  })
});

module.exports = router;
