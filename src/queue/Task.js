class Task {
    setToken(uuid) {
        this.uuid = uuid;
    }

    setEmail(email) {
        this.email = email;
    }

    setRequestedAt(datetime) {
        this.requestedAt = datetime;
    }

    [Symbol.toPrimitive]() {
        return JSON.stringify(this);
    }
}

module.exports = {
    Task
}
