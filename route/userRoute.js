const express = require('express')
const route=express.Router()
const userController = require('../controller/userController')

route.post('/signup',userController.signUp)


module.exports=route