const express = require('express');
const mongoConnect = require('./db/connect');
const userRouters = require('./routers/userRouter');
const authrouter = require ('./routers/authrouter')

const app = express();


require('dotenv').config();


app.use(express.static('../client'));

// Connect to MongoDB
mongoConnect();


app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use(userRouters);
app.use(authrouter);

app.listen(process.env.PORT, () =>{
    console.log(`server running at http://localhost:${process.env.PORT}`)
});