const express = require('express');

const movieRouter = require('./routes/movieRoutes');
const authRouter = require('./routes/authRoutes');

let app = express();
app.use(express.json());
app.use('/api/v1/movies',movieRouter);
app.use('/api/v1/users',authRouter);

app.all('*',(req,res,next)=>{
    res.status(404).json({
        status : 'fail',
        message : `Can't find ${req.originalUrl} on the server`
    })
    next();
})

module.exports = app;

