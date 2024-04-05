const jwt = require('jsonwebtoken');
const User = require('../model/userModel');
const tokenKey = process.env.TOKEN_SECRET;
const Group=require('../model/groupModel')

exports.authorization = async(req,res,next)=>{
    try {
        if(req.headers.gid){
            req.group=await Group.findByPk(req.headers.gid)
        }
        const token = req.headers.authorization;
        const decode = jwt.verify(token,tokenKey);
        const user = await User.findByPk(decode.userId);
        req.user = user;
        next();
        
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            res.json({ message: 'Time out' });
        } else {
            console.log('Error:', error);
            res.json({ message: 'Something wrong' });
        }
    }
}