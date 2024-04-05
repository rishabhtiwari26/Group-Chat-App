const express = require('express')
const route=express.Router()
const chatController = require('../controller/chatController')
const authController=require('../middleware/authetication')

route.post('/postchat',authController.authorization,chatController.postchat)
route.get('/getchats',authController.authorization,chatController.getchats)
route.post('/create-group',authController.authorization,chatController.createGroup)
route.get('/group-chats/:groupId',authController.authorization,chatController.groupChat)
module.exports=route