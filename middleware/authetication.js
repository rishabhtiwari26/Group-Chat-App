const jwt = require('jsonwebtoken');
const User = require('../model/userModel');
const tokenKey = process.env.TOKEN_SECRET;

exports.authorization = async(req,res,next)=>{
    try {
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