const chat =require('../model/chatModel')
const userTable=require('../model/userModel')

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

exports.getchats=(req,res,next)=>{
    const user=req.user
    chat.findAll({
        include:[{
            model:userTable,
            attributes:['name']
        }]
    }).then(chats=>{
            res.status(200).json({chats,userName:user.name})
        }).catch(e=>{
            console.log(e)
            res.send(401).json('something went wrong')
        })


}