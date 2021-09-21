const config = {
    mongo: {
        url: 'mongodb://localhost:27017',
        options: {
            dbName: 'cheatertest-registration-checker',
            useCreateIndex: true,
            useUnifiedTopology: true,
            useNewUrlParser: true
        }
    },
    amqp: {
        url: 'amqp://localhost'
    },
    queueRequestTask: 'requests'
};

module.exports = config;