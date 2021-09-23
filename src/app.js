const express = require('express');
const bodyParser = require('body-parser');

const Models = require('./models/models');
const Routes = require('./routes/routes');

const Cron = require('./cron');

const http = require('http');
const { Server } = require('socket.io');

const Sockets = require('./sockets')

const Application = function() {

    const PORT = 3000;
    const app = express();
    const cron = Cron();

    const server = http.createServer(app)
    const io = new Server(server);

    const socket = Sockets(io);

    function setAppConfig() {
        app.use(bodyParser.json())
        app.use(Routes);
        socket.initEvents();
    }

    //We can perform any action before the server is up
    async function beforeStart() {
        setAppConfig();
        cron.destroyAllQueuesAfter24hs();
        //await Models().init();
    }

    function start() {
        beforeStart().then(() => {
            app.listen(PORT, () => {
                console.log(`Server is listening at http://localhost:${PORT}`)
            })
        })
    }


    return {
        "start": start
    }

}


module.exports = Application;