const chat =require('../model/chatModel')

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