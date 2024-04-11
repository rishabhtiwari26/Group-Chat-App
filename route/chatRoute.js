const express = require('express')
const route=express.Router()
const chatController = require('../controller/chatController')
const authController=require('../middleware/authetication')
const multerMiddleware = require('../middleware/multer')
const upload = multerMiddleware.multer.single('image');

route.post('/postchat',authController.authorization,chatController.postchat)
route.get('/getchats',authController.authorization,chatController.getchats)
route.post('/create-group',authController.authorization,chatController.createGroup)
route.get('/group-chats/:groupId',authController.authorization,chatController.groupChat)
route.post('/post-image',authController.authorization,upload,chatController.postImage)
module.exports=route