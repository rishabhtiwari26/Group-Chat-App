const express = require('express')
const route=express.Router()
const chatController = require('../controllers/chat')
const authController=require('../middleware/authetication')
const multerMiddleware = require('../middleware/multer')
const upload = multerMiddleware.multer.single('image');

route.post('/postchat',authController.authorization,chatController.postchat)
route.get('/getchats',authController.authorization,chatController.getchats)
route.get('/get-old-chats',authController.authorization,chatController.getOldChats)

route.post('/create-group',authController.authorization,chatController.createGroup)
route.get('/group-chats/:groupId',authController.authorization,chatController.groupChat)
route.post('/post-image',authController.authorization,upload,chatController.postImage)
module.exports=route