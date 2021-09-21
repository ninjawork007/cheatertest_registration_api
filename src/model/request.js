const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const RequestSchema = Schema({
    email: { type: String, default: null },
    token: { type: String, default: null },
    process: [{
        uid: { type: String, default: null },
        worker_name: { type: String, default: null },
        timestamp: { type: Number, default: null },
        emailExist: { type: mongoose.Mixed, default: null },
    }],
    created_at: { type: Number, default: null }
});

module.exports = mongoose.model('request', RequestSchema);
