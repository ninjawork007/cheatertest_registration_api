class Queue {
    #channel;
    #name;
    #mapper;

    constructor(channel, name, mapper) {
        this.#channel = channel;
        this.#name = name;
        this.#mapper = mapper;
    }

    push(request) {
        const task = this.#mapper.map(request);
        const queueName = this.#name;

        this.#channel.assertQueue(queueName).then((ok) => {
            this.#channel.sendToQueue(queueName, Buffer.from(task));
        });
    }
}

module.exports = {
    Queue
}
