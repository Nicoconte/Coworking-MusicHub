const redisClient = require('../configs/redis');

const SongQueueService = () => {

    const client = redisClient;

    const queueKey = (roomId) => `queue-${roomId}`;

    let currentItemsInQueue = []

    function push(roomId, songUrl) {
    
        currentItemsInQueue = [];

        client.lpush(queueKey(roomId), songUrl);
        
        iterateByKey(queueKey);
    }

    function get() {
        return currentItemsInQueue;
    }

    function iterateByKey(key) {

        currentItemsInQueue = []

        client.lrange(key, 0, -1, (error, items) => {
            items.forEach(i => {
                currentItemsInQueue.push(i);
            });
        }); 
    }

    function getQueueById(roomId) {
        currentItemsInQueue = [];

        client.lrange(queueKey(roomId), 0, -1, (error, items) => {
            items.forEach(i => {
                currentItemsInQueue.push(i);
            });
        });        
    }

    return {
        "push": push,
        "get": get,
        "iterateByKey": iterateByKey,
        "getQueueById": getQueueById
    }
}


module.exports = SongQueueService;

