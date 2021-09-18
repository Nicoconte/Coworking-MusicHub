const Users = require('../models/user')

const uuid = require('uuid');

const UserService = function () {

    async function createAsync(userData) {
        let id = uuid.v4().toString();

        let user = await Users.create({
            id: id,
            username: userData.username,
            password: userData.password
        }).catch(err => {
            console.log("CreateAsync Error: ", err)
        })

        return user;
    }

    async function existsAsync(username) {
        let user = await Users.findOne({
            where: {
                username: username
            }
        }).catch(err => {
            console.log("ExistsAsync Error: ", err);
        })

        return user ? true : false; 
    }

    return {
        "createAsync": createAsync,
        "existsAsync": existsAsync
    }

}

module.exports = UserService

