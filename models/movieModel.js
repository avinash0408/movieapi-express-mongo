const mongoose = require('mongoose');


const movieSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required field!'],
        unique: true,
        trim: true
    },
    description: {
        type: String,
        required: [true, 'Description is required field!'],
        trim: true
    },
    duration: {
        type: Number,
        required: [true, 'Duration is required field!']
    },
    ratings: {
        type: Number,
    },
    totalRating: {
        type: Number
    },
    releaseYear: {
        type: Number,
        required: [true, 'Release year is required field!']
    },
    releaseDate:{
        type: Date
    },
    createdAt: {
        type: Date,
        default: Date.now(),
        select: false
    },
    genres: {
        type: [String],
        required: [true, 'Genres is required field!'],
    },
    directors: {
        type: [String],
        required: [true, 'Directors is required field!']
    },
    coverImage:{
        type: String,
        require: [true, 'Cover image is required field!']
    },
    actors: {
        type: [String],
        require: [true, 'actors is required field!']
    },
    price: {
        type: Number,
        require: [true, 'Price is required field!']
    },
    createdBy: String
},{
    toJSON : {virtuals : true},
    toObject : {virtuals : true}
})
movieSchema.virtual('durationInHours').get(function(){
    return (this.duration/60).toFixed(2);
})
const Movie = mongoose.model('Movie', movieSchema);

module.exports = Movie;