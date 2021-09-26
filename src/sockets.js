const redisClient = require('./configs/redis');

const Sockets = function (io) {

    const client = redisClient;

    function initEvents() {
        io.on('connection', (socket) => {

            socket.on('access-room', (roomId) => {
                socket.join(roomId);
            });
            
            socket.on('update-song-queue', (data) => {
                
                let roomId = data.roomId;

                client.lpush(`queue-${roomId}`, data.songUrl);

                let queue = []
                
                client.lrange(`queue-${roomId}`, 0, -1, (error, items) => {
                    items.forEach(i => {
                        queue.push(i);
                    });
                    console.log(`Sending to Room ${roomId}`)
                    io.to(roomId).emit('retrieve-queue-for-all', queue);
                });

            });

            socket.on('request-queue-client', (roomId) => {
                let queue = []
                
                client.lrange(`queue-${roomId}`, 0, -1, (error, items) => {
                    items.forEach(i => {
                        queue.push(i);
                    });
                    console.log(`Sending to Client: ${socket.id}`)
                    io.to(socket.id).emit('retrieve-queue-client', queue);
                });               
            })

        })
    }

    return {
        "initEvents": initEvents
    }

}

module.exports = Sockets