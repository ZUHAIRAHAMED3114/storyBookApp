const mongoose = require('mongoose');

//defining a model 
// models are defined through schema interface


const UserSchema = new mongoose.Schema({
    googleId: {
        type: String,
        required: true
    },
    displayName: {
        type: String,
        requierd: true
    },
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    image: {
        type: String
    },
    creartedAt: {
        type: Date,
        default: Date.now
    }
})


module.exports = mongoose.model('User', UserSchema);