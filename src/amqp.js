const amqp = require('amqplib');
const config = require('./config');

module.exports = amqp.connect(config.amqp.url).then(conn => {
    return conn.createChannel();
});
