const express = require('express');
const router = express.Router({mergeParams: true});
const Request = require('../model/request');
const {v4: uuidv4} = require('uuid');
const { Queue } = require('../queue/Queue');
const { Mapper } = require('../queue/Mapper');
const channel = require('../amqp');
const config = require('../config');

router.get('/api/result', async (req, res) => {
    const token = req.query.token || null;

    if (!token) {
        return res.json({
            success: false,
            message: 'Invalid params'
        });
    }

    const request = await Request.findOne({
        "token": token
    });

    if (request) {
        const timeProgress = Math.min(1, (Date.now() - request.created_at) / (4 * 60 * 1000));
        const workersProgress = Math.min(1, request.process.filter(item => !item.uid).length / 76);
        return res.json({
            success: true,
            progress: Math.min(1, Math.max(workersProgress, timeProgress)),
            data: addAliases(request.process)
        });
    }

    return res.json({success: false});
});

router.post('/api/request', async (req, res, next) => {
    const email = req.body.email || null;

    if (!validateEmail(email)) {
        return res.json({
            success: false,
            message: 'Invalid email'
        });
    }

    const existsEmail = await Request
        .findOne({email: email})
        .sort({created_at: -1});

    if (existsEmail && (Date.now() - existsEmail.created_at) < 600000) {
        return res.json({
            success: true,
            email: existsEmail.email,
            token: existsEmail.token
        })
    }

    const request = new Request();
    request.email = req.body.email;
    request.token = uuidv4();
    request.created_at = Date.now();
    request.save(err => {
        channel.then(ch => {
            const queue = new Queue(ch, config.queueRequestTask, new Mapper());
            queue.push(request);
        });
    });

    return res.json({
        success: true,
        email: request.email,
        token: request.token
    })
});

function validateEmail(email) {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}

function addAliases(results) {
    const aliaces = {
        "ashley.cynic.al": "Ashley Madison (limited)",
    };
    for (var result of results) {
        if (typeof aliaces[result.worker_name] === 'string') {
            result.worker_name = aliaces[result.worker_name];
        }
    }
    return results;
}

module.exports = router;
