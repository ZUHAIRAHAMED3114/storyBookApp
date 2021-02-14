const Router = require('express').Router();
const Story = require('../Models/Story');
const { ensureAuth } = require('../Middleware/authenticate')
const ejsHelper = require('../helper/ejs')

/* routers */
Router.get('/add', ensureAuth, (req, res) => {
    res.render('stories/add');

})
Router.post('/', ensureAuth, async(req, res) => {
    try {
        // we are adding the user.id to the story document 
        // and finally saving i.e document in the stody database...
        /// point to note i.e 
        // the relation between the story and the user is like not an embedded 
        // but relation is like foreign key type 
        req.body.user = req.user.id;
        var data = await Story.create(req.body);
        console.log('after adding new story to the database ');

        res.redirect('/dashboard');


    } catch (error) {
        console.log(error);
        res.render('Errors/500');
    }



});

Router.get('/:id', ensureAuth, async(req, res) => {
    try {
        let story = await Story.findById(req.params.id)
            .populate('user')
            .lean();

        if (!story) {
            return res.render('Errors/404');
        }

        res.render('stories/show', {
            story,
            ejsHelper
        })
    } catch (error) {
        console.error(error);
        res.render('Errors/404');

    }

})

Router.get('/', ensureAuth, async(req, res) => {
    try {

        const stories = await Story.find({ status: 'public' })
            .populate('user')
            .sort({ createdAt: 'desc' })
            .lean();

        console.log("collection of stories id are below ");
        stories.forEach(story => {
            console.log(story._id);
        })



        console.log(stories);
        res.render('stories/index', {
            stories,
            user: stories.user,
            ejsHelper,
            user: req.user

        })

    } catch (error) {
        console.error(err);
        res.render('Errors/500');
    }

})


Router.get('/edit/:id', ensureAuth, async(req, res) => {

    try {
        console.log("request parameter" + req.params.id)
        const story = await Story.findOne({
            _id: req.params.id
        }).lean();

        console.log(story);
        if (!story) {
            return res.render('Errors/404')
        }


        if (story.user != req.user.id) {
            response.redirect('/stories')
        } else {
            res.render('stories/edit', {
                story
            })
        }

    } catch (error) {
        console.error(error)
        return res.render('Errors/500');
    }
})

Router.put('/:id', ensureAuth, async(req, res) => {
    let story = await Story.findOne({
        _id: req.params.id
    }).lean();


    if (!story) {
        return res.render('Errors/404')
    } else {
        // now update this story 

        story = await Story.findOneAndUpdate({
            _id: req.params.id
        }, req.body, {
            new: true,
            runValidators: true
        });

        return res.redirect('/dashboard');
    }

})

Router.delete('/:id', ensureAuth, async(req, res) => {
    try {
        await Story.remove({
            _id: req.params.id
        })

        res.redirect('/dashboard')
    } catch (error) {

        console.error(error)
        return res.render('Errors/500');
    }

})

Router.get('/user/:id', ensureAuth, async(req, res) => {
    try {

        const stories = await Story.find({
                user: req.user.id,
                status: 'public'
            }).populate('user')
            .lean();

        res.render('stories/index', {
            stories,
            ejsHelper
        })


    } catch (error) {
        console.log(error);
        res.render('Errors/500')
    }
})

module.exports = Router;