const chat =require('../model/chatModel')
const userTable=require('../model/userModel')
const {Op}=require('sequelize')

exports.postchat=(req,res,next)=>{
    const user=req.user
    const newChat =req.body.chat
    chat.create({
        chat:newChat,
        userDetailId:user.id
    })
}


// const chat =require('../model/chatModel')

// exports.postchat=(req,res,next)=>{
//     const user=req.user
//     const newChat =req.body.chat
//     user.createChat({chat:newChat})
// }
// Example route for fetching new chats since the last chat ID

exports.getchats=(req,res,next)=>{
    console.log(req.query,'req.query')
    const lastChatId = req.query.lastChatId
    console.log(lastChatId,'lastChatId')
    
    chat.findAll({
        where:
            {id:{
                [Op.gt]:lastChatId
        }},
        include:[{
            model:userTable,
            attributes:['name']
        }]
    })
        .then(newChats => {
            res.status(200).json(newChats)
        })
        .catch(error => {
            console.error('Error fetching new chats:', error)
            res.status(500).json({ error: 'No new Chats' })
        })
}