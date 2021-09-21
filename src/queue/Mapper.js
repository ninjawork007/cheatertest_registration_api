const { Task } = require('./Task');

class Mapper {
    map(request) {
        const task = new Task();
        task.setToken(request.token);
        task.setEmail(request.email);
        task.setRequestedAt(request.created_at);

        return task;
    }
}

module.exports = {
    Mapper
}
