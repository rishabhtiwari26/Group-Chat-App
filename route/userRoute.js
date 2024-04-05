const express = require('express')
const route=express.Router()
const userController = require('../controller/userController')
const authController=require('../middleware/authetication')

route.post('/signup',userController.signUp)
route.post('/login',userController.login)
route.get('/get-groups',authController.authorization,userController.getGroups)
route.post('/add-member',authController.authorization,userController.addMember)

module.exports=route