const express = require('express')
const route=express.Router()
const userController = require('../controllers/user')
const authController=require('../middleware/authetication')

route.post('/signup',userController.signUp)
route.post('/login',userController.login)
route.get('/get-groups',authController.authorization,userController.getGroups)
route.post('/add-member',authController.authorization,userController.addMember)
route.get('/get-all-group-users',authController.authorization, userController.getAllGroupUsers);
route.delete('/remove-user',authController.authorization, userController.removeUser);
route.post('/make-admin',authController.authorization, userController.makeAdmin);
route.post('/remove-admin',authController.authorization, userController.removeAdmin);



module.exports=route