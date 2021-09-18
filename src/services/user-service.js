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

    async function findByUsernameAndPasswordAsync(userData) {
        let user = await Users.findOne({
            where: {
                username: userData.username,
                password: userData.password
            }
        }).catch(err => {
            console.log("FindByUsernameAndPassword Error: ", err);
        })

        return user ? user : null;
    }

    return {
        "createAsync": createAsync,
        "existsAsync": existsAsync,
        "findByUsernameAndPasswordAsync": findByUsernameAndPasswordAsync
    }

}

module.exports = UserService

