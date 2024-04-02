const User = require('../model/userModel')
const bcrypt = require('bcrypt')
const jwt =require('jsonwebtoken')
function generateAccessToken(id){
    return jwt.sign({userid:id},process.env.TOKEN_SECRET)


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
                        res.status(200).send({success:true,message:'User Login successfully',redirectUrl: '/chat/chat_app',token:generateAccessToken(user.id),userName:user.name})
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