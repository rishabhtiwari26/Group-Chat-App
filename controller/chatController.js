const chat =require('../model/chatModel')
const userTable=require('../model/userModel')
const Group=require('../model/groupModel')
const {Op}=require('sequelize')
const AWS=require('aws-sdk')
const UserGroup=require('../model/userGroupModel')

function uploadToS3(data,filename){
    const BUCKET_NAME=process.env.BUCKET_NAME;
    const IAM_USER_KEY=process.env.IAM_USER_KEY
    const IAM_USER_SECRET=process.env.IAM_USER_SECRET
    
    let s3bucket= new AWS.S3({
        accessKeyId:IAM_USER_KEY,
        secretAccessKey:IAM_USER_SECRET
    })

    let params={
        Bucket:BUCKET_NAME,
        Key:filename,
        Body:data,
        ACL:'public-read'
    }
    return new Promise((resolve,reject)=>{
        s3bucket.upload(params,(err,s3response)=>{
            if(err){
                console.log(err,'something went wrong in aws')
                reject(err)
            }else{
                console.log('success',s3response)
                resolve(s3response.Location)
            }
        })

    })
}


exports.postchat=(req,res,next)=>{
    const user=req.user
    const newChat =req.body.chat
    const group=req.group
    if(group){
        chat.create({
            chat:newChat,
            userDetailId:user.id,
            groupId:group.id
        }).then(chat=>{
            const requiredData={
                id:chat.dataValues.id,
                chat:chat.dataValues.chat,
                userDetail:{
                    name:user.name,
                    email:user.email
                }
            }
            
            res.status(200).json(requiredData)
        })
        .catch(e=>res.json({success:false,message:'something went wrong'}))
        
    }else{
        chat.create({
            chat:newChat,
            userDetailId:user.id
        }).then(chat=>{
            const chatId=chat.dataValues.id
            res.status(200).json({success:true,message:'msg added',chatId})
        })
        .catch(e=>res.json({success:false,message:'something went wrong'}))    
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

    exports.createGroup = async (req, res, next) => {
        try {
            const user = req.user;
            console.log(req.user, req.body);
            const { groupName } = req.body;
    
            const data = await user.createGroup({
                groupName: groupName,
                createdBy: user.id
            });
            const UserGroupAdmin = await UserGroup.findOne({ where: { userDetailId: user.id, groupId: data.dataValues.id } });
            await UserGroupAdmin.update({ isAdmin: true });
            res.status(200).json({ success: true, message: 'Group Created', data });
        } catch (error) {
            console.error(error);
            res.json({ success: false, message: 'Something went wrong' });
        }
    };
    
 

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

exports.postImage=async (req,res,next)=>{
    const user=req.user
    const image = req.file;
    const group=req.group
    console.log(req,'req',image,'image')
    const filename = `chat-images/group${group.id}/user${user.id}/${Date.now()}_${image.originalname}`;
    const imageUrl = await uploadToS3(image.buffer, filename)
    console.log(imageUrl)
    if(group){
    chat.create({
        chat:imageUrl,
        userDetailId:user.id,
        groupId:group.id,
        isImage:true
    }).then(chat=>{
        const requiredData={
            id:chat.dataValues.id,
            chat:chat.dataValues.chat,
            userDetail:{
                name:user.name,
                email:user.email
            }
        }
        
        res.status(200).json(requiredData)
    })
    .catch(e=>res.json({success:false,message:'something went wrong'}))
    }else{
    chat.create({
        chat:newChat,
        userDetailId:user.id,
        isImage:true
    }).then(chat=>{
        const chatId=chat.dataValues.id
        res.status(200).json({success:true,message:'msg added',chatId})
    })
    .catch(e=>res.json({success:false,message:'something went wrong'}))    
}}