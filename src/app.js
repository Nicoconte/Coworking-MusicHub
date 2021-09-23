const Models = require('./models/models');
const Routes = require('./routes/routes');
const Sockets = require('./sockets')
const Cron = require('./cron');

const bodyParser = require('body-parser');
const cors = require('cors');

const express = require('express');
const app = express();

const http = require('http');
const { Server } = require('socket.io');


const Application = function() {

    const PORT = 3000;
    const cron = Cron();

    const server = http.createServer(app);
    
    const io = new Server(server, {
        cors: {
            "origin": "*",
            "methods": "*" 
        }
    });

    const socket = Sockets(io);

    //We can perform any action before the server is up
    async function setupBeforeStart() {

        app.use(bodyParser.json())
        app.use(Routes);
        app.use(cors());
        
        cron.destroyAllQueuesAfter24hs();
        //await Models().init();
    }

    async function start() {
        await setupBeforeStart()
        
        socket.initEvents();

        server.listen(PORT, () => {
            console.log(`Server is listening at http://localhost:${PORT}`)
        })
    }


    return {
        "start": start
    }

}


module.exports = Application;