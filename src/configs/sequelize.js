const { Sequelize } = require('sequelize');

const sequelize = new Sequelize("coworking_music_hub_db","root", "",{
    host: "localhost",
    dialect: "mysql"
})  

module.exports = sequelize;