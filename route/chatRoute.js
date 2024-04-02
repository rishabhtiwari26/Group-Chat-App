const express = require('express')
const route=express.Router()
const chatController = require('../controller/chatController')
const authController=require('../middleware/authetication')

route.post('/postchat',authController.authorization,chatController.postchat)
route.get('/getchats',authController.authorization,chatController.getchats)

module.exports=route