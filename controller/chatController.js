const chat =require('../model/chatModel')
const userTable=require('../model/userModel')
const Group=require('../model/groupModel')
const {Op}=require('sequelize')

exports.postchat=(req,res,next)=>{
    const user=req.user
    const newChat =req.body.chat
    const group=req.group
    if(group){
        chat.create({
            chat:newChat,
            userDetailId:user.id,
            groupId:group.id
        })
    }else{
        chat.create({
            chat:newChat,
            userDetailId:user.id
        })    
    }
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
    const groupId = req.group.id
    console.log(lastChatId,'lastChatId')
    if (groupId){
        console.log('in if getChat')
        chat.findAll({
            where:
                {id:{
                    [Op.gt]:lastChatId
                },groupId:groupId
            },
            include:[{
                model:userTable,
                attributes:['name','email']
            }],
            attributes: ['id','chat']
        })
            .then(newChats => {
                res.status(200).json(newChats)
            })
            .catch(error => {
                console.error('Error fetching new chats:', error)
                res.status(500).json({ error: 'No new Chats' })
            })
    }else{
        console.log('in else getChat')
        chat.findAll({
            where:
                {id:{
                    [Op.gt]:lastChatId
                }
            },
            include:[{
                model:userTable,
                attributes:['name','email']
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

    }

exports.createGroup=(req,res,next)=>{
    const user =req.user
    console.log(req.user,req.body)
    const {groupName}=req.body
    user.createGroup({
        groupName:groupName,
        createdBy:user.id
    }).then(data=>{
        console.log('Group Created')
        res.status(200).json({success:true,message:'Group Created',data})
    }).catch(e=>{
        console.log(e)
        res.json({success:false,message:'Something went wrong'})
    })

}
exports.groupChat=async (req, res,next) => {
    const groupId = req.params.groupId;
    console.log(groupId,'groupId')
    try {
        const gChats = await chat.findAll({
            where: { groupId },
            include: [{
                model: userTable,
                attributes: ['name']
            }]
        });
        
        res.status(201).json(gChats);
    } catch (error) {
        console.error('Error fetching group chats:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}