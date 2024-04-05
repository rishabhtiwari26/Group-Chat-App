const express = require('express')
const dotenv=require('dotenv');
dotenv.config()

const app = express()
const bodyParser=require('body-parser')
const cors = require('cors')
const path=require('path')

const sequelize  = require('./util/database')

const User = require('./model/userModel')
const Chat =require('./model/chatModel')
const Group =require('./model/groupModel')
const UserGroup =require('./model/userGroupModel')

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
app.use('/groupchat.htm', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'groupchat.htm'));
});

User.hasMany(Chat)
Chat.belongsTo(User,{constraint:true,onDelete:'CASCADE'})

Group.hasMany(Chat);
Chat.belongsTo(Group);

User.belongsToMany(Group, { through: 'UserGroup' });
Group.belongsToMany(User, { through: 'UserGroup' })

sequelize.sync()
    .then(res=>{
        // console.log(res)
        app.listen(3000)
    })
    .catch(e=>console.log(e))