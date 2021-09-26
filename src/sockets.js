const redisClient = require('./configs/redis');

const Sockets = function (io) {

    const client = redisClient;

    function initEvents() {
        console.log("Hello, world!");

        io.on('connection', (socket) => {

            console.log(`Connected! Socket ID:${socket.id}`);

            socket.on('song-queue-update', (data) => {
                
                let roomId = data.roomId;

                client.lpush(`queue-${roomId}`, data.songUrl);

                let queue = []
                
                client.lrange(`queue-${roomId}`, 0, -1, (error, items) => {
                    items.forEach(i => {
                        queue.push(i);
                    });
                    console.log("Queue Updated from Server ", queue);
                    io.to(roomId).emit('get-updated-queue', queue);
                });

            });

            socket.on('access-room', (roomId) => {
                socket.join(roomId);
            });

            socket.on('request-queue', (roomId) => {
                let queue = []
                
                client.lrange(`queue-${roomId}`, 0, -1, (error, items) => {
                    items.forEach(i => {
                        queue.push(i);
                    });
                    console.log(`Queue from Server to Room ${roomId} `, queue);
                    io.to(roomId).emit('get-updated-queue', queue);
                });                
            })
        })
    }

    return {
        "initEvents": initEvents
    }

}

module.exports = Sockets