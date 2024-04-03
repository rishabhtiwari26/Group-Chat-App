const express = require('express')
const dotenv=require('dotenv');
dotenv.config()

const app = express()
const bodyParser=require('body-parser')
const cors = require('cors')
const path=require('path')

const sequelize  = require('./util/database')

const user = require('./model/userModel')
const chat =require('./model/chatModel')
const Group =require('./model/groupModel')

const userRoute=require('./route/userRoute')
const chatRoute=require('./route/chatRoute')

app.use(bodyParser.json())
app.use(cors({
    origin:'http://127.0.0.1:5500',
    methods:['GET',"POST"]
}))


app.use('/user',userRoute)
app.use('/chat',chatRoute)

app.use('/login.htm', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'login.htm'));
});
app.use('/signup.htm', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'signup.htm'));
});
app.use('/chat_app.htm', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'chat_app.htm'));
});

user.hasMany(chat)
chat.belongsTo(user,{constraint:true,onDelete:'CASCADE'})

Group.hasMany(chat);
chat.belongsTo(Group);

user.belongsToMany(Group, { through: 'UserGroup' });
Group.belongsToMany(user, { through: 'UserGroup' })

sequelize.sync()
    .then(res=>{
        // console.log(res)
        app.listen(3000)
    })
    .catch(e=>console.log(e))