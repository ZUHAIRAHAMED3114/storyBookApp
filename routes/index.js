const Router = require('express').Router();
const { ensureAuth, ensureGuest } = require('../Middleware/authenticate')
const Story = require('../Models/Story');
const ejshelper = require('../helper/ejs')



Router.get('/', ensureGuest, (req, res) => {
    console.log('/ get request  next middleware is execured ')
    res.render('login', {
        layout: './layouts/login'
    })
})

Router.get('/dashboard', ensureAuth,
    async(req, res) => {

        try {

            const story = await Story.find({
                    user: req.user.id
                }).lean()
                // lean method convert mongoose object into plain javascript object

            res.render('Dashboard', {
                layout: './layouts/layout',
                name: req.user.firstName,
                stories: story,
                ejshelper
            });

        } catch (error) {

            res.render('Errors/500');
        }






    })


module.exports = Router;