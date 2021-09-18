const express = require('express');
const bodyParser = require('body-parser');

const Models = require('./models/models')();
const Routes = require('./routes/routes');

const Application = function() {

    const PORT = 3000;
    const app = express();

    function setAppConfig() {
        app.use(bodyParser.json())
        app.use(Routes);
    }

    //We can perform any action before the server is up
    async function beforeStart() {
        setAppConfig();
        
        await Models.init();
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