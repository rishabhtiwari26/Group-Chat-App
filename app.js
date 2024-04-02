const express = require('express')

const app = express()
const bodyParser=require('body-parser')
const sequelize  = require('./util/database')
const path=require('path')

// const user = require('./model/userModel')
const userRoute=require('./route/userRoute')

app.use(bodyParser.json())



app.use('/user',userRoute)

app.use('/login.htm', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'login.htm'));
});
app.use('/signup.htm', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'signup.htm'));
});

sequelize.sync()
    .then(res=>{
        // console.log(res)
        app.listen(3000)
    })
    .catch(e=>console.log(e))