const Sequelize  = require('sequelize')
const sequelize=require('../util/database')


const chat = sequelize.define('chatDetails',{
    id:{
        allowNull:false,
        primaryKey:true,
        autoIncrement:true,
        type:Sequelize.INTEGER
    },
    chat:{
        type:Sequelize.STRING,
        allowNull:false
    },
    isImage:{
        type : Sequelize.BOOLEAN , 
      defaultValue : false
    },
}
)
module.exports=chat