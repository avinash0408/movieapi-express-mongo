const dotenv = require('dotenv');
dotenv.config({path:'./config.env'});

const mongoose = require('mongoose');

const app = require('./app');

const port =3000;

mongoose.connect(process.env.DB_Url).then((conn) =>{
    console.log("DB connection success");
}).catch((error)=>{
    console.log("Error occurred");
})


app.listen(port,()=>{
    console.log("server has started");
});