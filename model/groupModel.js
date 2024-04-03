const Sequelize  = require('sequelize')
const sequelize=require('../util/database')


const user = sequelize.define('group',{
    id:{
        allowNull:false,
        primaryKey:true,
        autoIncrement:true,
        type:Sequelize.INTEGER
    },
    groupName:{
        type:Sequelize.STRING,
        allowNull:false
    },
    membersNo:{
        type:Sequelize.INTEGER
    },
    createdBy:{
        type:Sequelize.STRING,
        allowNull:false
    }
}
)
module.exports=user