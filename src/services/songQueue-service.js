const redisClient = require('../configs/redis');

const SongQueueService = () => {

    const client = redisClient;

    const queueKey = (roomId) => `queue-${roomId}`;

    let currentItemsInQueue = []

    function push(roomId, songUrl) {
    
        currentItemsInQueue = []

        client.lpush(queueKey(roomId), songUrl);
        
        client.lrange(queueKey(roomId), 0, -1, (error, items) => {
            items.forEach(i => {
                currentItemsInQueue.push(i);
            });
        }); 

    }

    function get() {
        return currentItemsInQueue;
    }

    return {
        "push": push,
        "get": get
    }
}


module.exports = SongQueueService;

