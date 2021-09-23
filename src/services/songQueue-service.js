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
        client.lrange(key, 0, -1, (error, items) => {
            items.forEach(i => {
                currentItemsInQueue.push(i);
            });
        }); 
    }

    return {
        "push": push,
        "get": get,
        "iterateByKey": iterateByKey
    }
}


module.exports = SongQueueService;

