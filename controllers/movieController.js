const movieModel = require('../models/movieModel');
const ApiHandler = require('../utils/ApiHandler');

// exports.validateBody = (req,res,next) => {
//     if(!req.body.name || !req.body.releaseYear){
//         return res.status(400).json({
//             status : 'fail',
//             message : 'No a valid body. Movie name and release year are required.'
//         })
//     }
//     next();
// }
exports.getTopRatedMovies = (req,res,next)=>{
    req.query.limit=5;
    req.query.sort='-ratings';

    next();
}

//ROUTE HANDLERS FUNCTIONS
exports.getAllMovies = async (req,res)=>{
    try{
        let apiHandler = new ApiHandler(movieModel.find(),req.query).filter().sort().limitFields().pagination();
        let movies = await apiHandler.query;
        res.status(200).json({
            status : 'success',
            count : movies.length,
            data : {
                movies
            }
        })
    }catch(err){
        res.status(400).json({
            status : 'fail',
            message : err.message
        })
    }
 }

 exports.getMovie = async (req,res)=>{
   try{
      //  const movie = await movieModel.find({_id : req.params.id});
        const movie = await movieModel.findById(req.params.id);
        res.status(200).json({
            status : 'success',
            data : {
                movie
            }
        })
   }catch(err){
        res.status(400).json({
            status : 'fail',
            message : err.message
        })
   }
 }

 exports.createMovie = async (req,res)=>{
    // const testMovie = new movieModel(req.body);
    // testMovie.save().then().catch();
    try{
        const movie = await movieModel.create(req.body);
        res.status(201).json({
            status : 'success',
            data : {
                movie
            }
        })
    }catch(err){
        res.status(400).json({
            status : 'fail',
            message : err.message
        })
    }
}

exports.updateMovie = async (req,res)=>{
   try{
    const movie = await movieModel.findByIdAndUpdate(req.params.id,req.body,{new : true, runValidators : true});
    res.status(200).json({
        status : 'success',
        data : {
            movie
        }
    })
   }catch(err){
        res.status(404).json({
            status : 'fail',
            message : err.message
        })
    }
}

exports.deleteMovie = async (req,res)=>{
    try{
        await movieModel.findByIdAndDelete(req.params.id);
        res.status(204).json({
            status : 'success',
            data : null
        })
       }catch(err){
            res.status(404).json({
                status : 'fail',
                message : err.message
            })
        }
}

exports.getMovieStats = async (req, res) => {
    try{
        const stats = await movieModel.aggregate([
            { $match: {ratings: {$gte: 4.5}}},
            { $group: {
                _id: '$releaseYear',
                avgRating: { $avg: '$ratings'},
                avgPrice: { $avg: '$price' },
                minPrice: { $min: '$price' },
                maxPrice: { $max: '$price' },
                priceTotal: { $sum: '$price'},
                movieCount: { $sum: 1}
            }},
            { $sort: { minPrice: 1}}
            //{ $match: {maxPrice: {$gte: 60}}}
        ]);

        res.status(200).json({
            status: 'success',
            count: stats.length,
            data: {
                stats
            }
        });
    }catch(err) {
        res.status(404).json({
            status:"fail",
            message: err.message
        });
    }
}

exports.getMovieByGenre = async (req, res) => {
    try{
        const genre = req.params.genre;
        const movies = await movieModel.aggregate([
            {$unwind: '$genres'},
            {$group: {
                _id: '$genres',
                movieCount: { $sum: 1},
                movies: {$push: '$name'}, 
            }},
            {$addFields: {genre: "$_id"}},
            {$project: {_id: 0}},
            {$sort: {movieCount: -1}},
            //{$limit: 6}
            {$match: {genre: genre}}
        ]);

        res.status(200).json({
            status: 'success',
            count: movies.length,
            data: {
                movies
            }
        });
    }catch(err) {
        res.status(404).json({
            status:"fail",
            message: err.message
        });
    }
}