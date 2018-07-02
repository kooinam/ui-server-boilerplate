import redis from 'redis';
import _ from 'lodash';

const openSocket = (server) => {
  let options = {
    prefix: process.env.API_SERVER_URL,
  };
  if (process.env.NODE_ENV === 'production') {
    options = _.assign(options, {
      host: process.env.REDIS_URL,
      port: '6379',
      password: process.env.REDIS_PASSWORD,
    });
  }
  const redisClient = redis.createClient(options);
  redisClient.subscribe('subscribers');
  const io = require('socket.io').listen(server);

  io.on('connection', (client) => {
    client.on('subscribeToNotification', (data) => {
      console.log(`connected to ${data.subscriberId}`);
      client.emit('notificationReceived', {
        subscriberId: data.subscriberId,
      });
      redisClient.on('message', (channel, subscriberId) => {
        if (data.subscriberId.toString() === subscriberId) {
          client.emit('notificationReceived', {
            subscriberId: data.subscriberId,
          });
        }
      });
    });
  });
}

export {
  openSocket,
};