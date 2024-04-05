const User = require('../model/userModel')
const Group=require('../model/groupModel')
const bcrypt = require('bcrypt')
const jwt =require('jsonwebtoken')
function generateAccessToken(id){
    return jwt.sign({userId:id},process.env.TOKEN_SECRET)


}

exports.signUp=(req,res,next)=>{
    const saltRounds=10
    const {name,email,password,}=req.body
    bcrypt.hash(password,saltRounds,(err,hash)=>{
        console.log(err)
        User.create({
            name:req.body.name,
            email:req.body.email,
            password:hash,
            mobileNumber:req.body.mobileNumber
        })
            .then(user=>{
                
                console.log('Signed-Up')
                res.send('User Signed-Up')
            })
            .catch(e=>{
                if(e.name==='SequelizeUniqueConstraintError'){
                    console.log('Email already exists')
                    res.send('Email already exists')
                }
                else{
                    console.log(e)
                    res.send('Something went wrong')
                }
            })
    })
    
}
exports.login=(req,res,next)=>{
    // console.log(req.body,req.body.id)
    User.findOne({where:{email:req.body.email}})
        .then(user=>{
            try{if(user){
                bcrypt.compare(req.body.password,user.password,(err,result)=>{
                    if (err){
                        throw new Error(err)
                    }
                    if(result===true){
                        res.status(200).send({success:true,message:'User Login successfully',redirectUrl: '/chat/chat_app',token:generateAccessToken(user.id),email:user.email})
                    }
                    else{
                        res.status(401).send({success:false,message:'Password do not match'})
                    }
                })
                
            }
            else{ 
                res.status(404).send({success:false,message:'User not found'})
            }}catch{e=>{
                console.log(e)
            }

            }
            
        })
}
exports.getGroups=async (req,res,next)=>{
    const user=req.user
    try {
        console.log('inside group controller')
        const userGroups = await user.getGroups();
        res.status(201).json(userGroups);
      } catch (err) {
        console.log(err);
      }
    };

exports.addMember = async (req, res, next) => {
    let userEmail = req.body.email;
    const group = req.group;
    const user = req.user;
    console.log(userEmail, 'userEmail', group, 'group', user, 'user');
    // console.log(Object.keys(group.__proto__));
    try {
        const foundUser = await User.findOne({
            where: { email: userEmail }
        });
        if (foundUser) {
            await group.addUserDetail(foundUser);
            res.status(200).send("User added to the group successfully.");
        } else {
            res.status(404).send("User not found.");
        }
    } catch (error) {
        console.log(error);
        res.status(500).send("Internal Server Error");
    }
};
