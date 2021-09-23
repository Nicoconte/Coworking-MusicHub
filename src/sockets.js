const SongQueueService = require('../src/services/songQueue-service')

const Sockets = function(io) {

    const songQueueService = SongQueueService();

    function initEvents() {
        io.on('connection', (socket) => {
          
          console.log(`Connected! Socket ID:${socket.id}`);

          socket.on('song-queue-update', (roomId) => {

            songQueueService.iterateByKey(`queue-${roomId}`)

            setTimeout(() => {
                io.to(roomId).emit('queue', songQueueService.get())
            },0);

          });

          socket.on('access-room', (roomId) => {
              socket.join(roomId);
          });
          
        })
    }

    return {
        "initEvents": initEvents
    }

}

module.exports = Sockets