const GoogleStrategy = require('passport-google-oauth20').Strategy;
const googleConfig = require('./googleConfig');

const User = require('../Models/User');
/*

function localauthenticate(passport) {

}
function facebookAuthentication(passport){

}
funciton twitterAuthentication(passport){

}GOOGLE_CLIENT_ID

//----------------------------------------------
//----------------------------------------------
//-----------------------------------------------
                 NOTE
    
    PLEASE RECTIFY THE ERROR SHOWING WHEN    
    {
        clientID:process.env.GOOGLE_CLIENT_ID,
        clientSecret:process.env.GOOGLE_CLIENT_SECRET,
    }

//-------------------------------------------------

//-------------------------------------------------

//--------------------------------------------------

*/


function googleAuthenticate(passport) {
    passport.use(new GoogleStrategy({
            clientID: googleConfig.CLIENT_ID,
            clientSecret: googleConfig.CLIENT_SECRET,
            callbackURL: '/auth/google/callback'
        },
        async(accessToken, refreshToken, profile, done) => {

            const newUser = {
                googleId: profile.id,
                displayName: profile.displayName,
                firstName: profile.name.givenName,
                lastName: profile.name.familyName,
                image: profile.photos[0].value

            }

            try {

                let user = await User.findOne({
                    googleId: profile.id
                })

                if (user) {
                    console.log('this data is already present in the database');
                    done(null, user);

                } else {
                    user = await User.create(newUser);
                    console.log('new user whos data is to be stored in the data base')
                    done(null, user);
                }

            } catch (error) {
                console.error(error);

            }

        }
    ));

    //passport.serializeUser();
    //passport.deserializeUser();

    /* the above serializer method will add the callback
            for i.e callbak user information and another callback
            is send send by the passport
    */


    passport.serializeUser((user, done) => {

        done(null, user.id);

    });
    passport.deserializeUser((id, done) => {

        User.findById(id, (err, user) => {
            done(err, user);
        });

    });

}

module.exports = googleAuthenticate;