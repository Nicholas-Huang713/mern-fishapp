const mongoose = require('mongoose');
const CatchSchema = require('./catch').schema;

//Schema
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    firstname: String,
    lastname: String,
    email: String,
    password: String,
    catchList: [CatchSchema],
    date: {
        type: String,
        default: Date.now()
    }
})

//Model
const User = mongoose.model('User', UserSchema);

module.exports = User;