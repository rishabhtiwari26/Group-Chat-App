const User = require('../model/userModel')
const Group=require('../model/groupModel')
const bcrypt = require('bcrypt')
const jwt =require('jsonwebtoken')
const UserGroup = require('../model/userGroupModel')
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
        const groupsWithAdmin=[]
        for(const group of userGroups){

            const groups = {
                id: group.id,
                name: group.groupName
            };
            groupsWithAdmin.push(groups);
        }
        
        res.status(201).json(groupsWithAdmin);
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
exports.getAllGroupUsers = async (req, res, next) => {
    try {
        console.log('inside, getAllGroupUsers', req.query);
        const groupId = req.query.gid;

        const group = await Group.findOne({ where: { id: groupId } });
        if (!group) throw new Error("No such group");

        const users = await group.getUserDetails({
            attributes: ['name', 'email'],
            through: { attributes: ['isAdmin'] }
          });
          const usersWithIsAdmin = users.map(user => ({
            name: user.name,
            email: user.email,
            isAdmin: user.UserGroup.isAdmin
        }));

        

        if (!users) {
            return res.status(404).json({ msg: 'No users found in the group' });
        }
        res.status(200).json({ users: usersWithIsAdmin });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, msg: 'Internal Server Error' });
    }
}


exports.removeUser = async (req, res, next) => {
    try {
        const useremail=req.query.email
        const group = req.group
        const user=req.user
        if (!group) {
            return res.status(409).json({ msg: 'There is no group exist' })
        }
        const member = await User.findOne({ where: { email:useremail} });
        
        if (user.dataValues.email == useremail) {
            return res.status(408).json({ message: "Admin cannot remove themselves from the group" })
        }

        const removedUser=await group.removeUserDetails(member);
        console.log(removedUser)
        res.status(200).send('Removed successfully');
    } catch (err) {
        console.log(err);
        res.status(500).json({ success: false, msg: 'Internal Server Error' });
    }
}

exports.makeAdmin = async (req, res, next) => {
    try {
        const useremail = req.body.email;
        const group = req.group
        if (!group) {
            return res.status(409).json({ success: false, message: 'No group exist' })
        }
        const member=await User.findOne({ where: { email:useremail}})
        console.log(member,'member')
        const UserGroupAdmin = await UserGroup.findOne({ where: { userDetailId: member.id, groupId: group.id } });
        console.log(UserGroupAdmin,'UserGroupAdmin')
        if (!UserGroupAdmin) {
            return res.status(409).json({ success: false, message: 'No member exist ' })
        }
        await UserGroupAdmin.update({ isAdmin: true });


        res.status(200).json({ success: true });
    } catch (Error) {
        console.log(Error);
        res.status(500).json({ success: false, msg: 'Internal Server Error' });
    }
}

exports.removeAdmin = async (req, res, next) => {
    try {
        const useremail = req.body.email;
        const group = req.group
        const user=req.user
        if (!group) {
            return res.status(409).json({ success: false, message: 'No group exist' })
        }
        const member=await User.findOne({ where: { email:useremail}})
        const UserGroupAdmin = await UserGroup.findOne({ where: { userDetailId: member.id, groupId: group.id } });
        if(UserGroupAdmin.dataValues.userDetailId==user.id){
            return res.status(408).json({ success: false, message: "Admin cannot remove their admin status" })
        }
        console.log(UserGroupAdmin,'UserGroupAdmin')
        if (!UserGroupAdmin) {
            return res.status(409).json({ success: false, message: 'No member exist ' })
        }
        await UserGroupAdmin.update({ isAdmin: false });


        res.status(200).json({ success: true });
    } catch (Error) {
        console.log(Error);
        res.status(500).json({ success: false, msg: 'Internal Server Error' });
    }
}