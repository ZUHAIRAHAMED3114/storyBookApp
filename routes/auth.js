const Router = require('express').Router();
const googleAuthenticate = require('../config/passport');


const passport = require('passport');
googleAuthenticate(passport);
// the above method make i.e use the passport for google authentication


// TOPIC-3 discussed regarding the oauth flow 
Router.get('/google',
    passport.authenticate('google', { scope: ['profile'] }));



Router.get('/google/callback',
    passport.authenticate('google', {
        failureRedirect: '/'
    }), (req, res) => {
        console.log('request is authenticated ' + req.isAuthenticated())
            //succesful authentication will redirect here
        res.redirect('/dashboard');

    })
Router.get('/logout', (req, res) => {
    console.log(req.isAuthenticated())
    req.logout();
    console.log(req.isAuthenticated())
        // redirect to the home page 
    res.redirect('/')

});
module.exports = Router;