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
const PasswordLink=require('./model/forgetPasswordModel')

const userRoute=require('./route/userRoute')
const chatRoute=require('./route/chatRoute')
const passwordRoute=require('./route/passwordRoute')
const websocket=require('./services/websocket') 

const httpServer = require('http').createServer(app);
const io = require('socket.io')(httpServer, {
    cors: ["http://127.0.0.1:5500"]
});

app.use(bodyParser.json())
app.use(cors({
    origin:'http://127.0.0.1:5500',
    methods:['GET',"POST"]
}))


app.use('/user',userRoute)
app.use('/chat',chatRoute)
app.use('/password',passwordRoute)

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
app.use('/reset_password.htm', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'reset_password.htm'));
});
app.use('/forgetpassword.htm', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'forgetPassword.htm'));
});

User.hasMany(Chat)
Chat.belongsTo(User,{constraint:true,onDelete:'CASCADE'})

Group.hasMany(Chat);
Chat.belongsTo(Group);

User.belongsToMany(Group, { through: 'UserGroup' });
Group.belongsToMany(User, { through: 'UserGroup' })

UserGroup.belongsTo(User);
UserGroup.belongsTo(Group)

User.hasMany(PasswordLink)
PasswordLink.belongsTo(User,{constraint:true,onDelete:'CASCADE'})

sequelize.sync().then(() => {
    io.on('connection', websocket);
    httpServer.listen(3000)
    console.log(`Server is running on port 3000`);
}).catch(err => {
    console.log('Server is not running due to internal problem',err);
})