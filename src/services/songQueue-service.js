const redisClient = require('../configs/redis');

const SongQueueService = () => {

    const client = redisClient;

    const queueKey = (roomId) => `queue-${roomId}`;

    let itemsFromQueue = []

    function push(roomId, songUrl) {
    
        itemsFromQueue = []

        client.lpush(queueKey(roomId), songUrl);
        
        client.lrange(queueKey(roomId), 0, -1, (error, items) => {
            items.forEach(i => {
                console.log("ITEMS ", items)
                itemsFromQueue.push(i);
            });
        }); 

    }

    function get() {
        console.log("A")
        return itemsFromQueue;
    }

    return {
        "push": push,
        "get": get
    }
}


module.exports = SongQueueService;

