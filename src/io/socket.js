const openSocket = (server) => {
  const io = require('socket.io').listen(server);

  io.on('connection', (client) => {
    client.on('subscribeToTimer', (interval) => {
      console.log('client is subscribing to timer with interval ', interval);
    });
  });
}

export {
  openSocket,
};