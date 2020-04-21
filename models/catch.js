const mongoose = require('mongoose');

//Schema
const Schema = mongoose.Schema;

const CatchSchema = new Schema({
    water: String,
    bait: String,
    species: String,
    latitude: Number,
    longitude: Number,
    creatorId: String,
    creatorName: String,
    date: {
        type: String,
        default: Date.now()
    }
})

//Model
const Catch = mongoose.model('Catch', CatchSchema);

module.exports = Catch;