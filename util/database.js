const Sequelize = require('sequelize')

const sequelize= new Sequelize('group-chat','root','sean90',{
    dialect:'mysql',
    host:'localhost'
})

module.exports=sequelize