const redisClient = require('./configs/redis');
const schedule = require('node-schedule');

const Cron = function() {
    
    const client = redisClient;

    function destroyAllQueuesAfter24hs() {
        const rule = new schedule.RecurrenceRule();

        rule.hour = 23;
        rule.minute = 59;

        schedule.scheduleJob(rule, () => {
            console.log("Starting...")
             client.keys("*", (err, keys) => {
                 keys.forEach(key => {
                    console.log("Deleting key => " + key);
                    client.del(key);
                 })
                 console.log("It's done!")
             })
        })
    }

    return {
        "destroyAllQueuesAfter24hs": destroyAllQueuesAfter24hs
    }
}


module.exports = Cron;