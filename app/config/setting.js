/**
 * Created by 2017 on 2017/12/15.
 */
"use strict";
let config = {
    mysql: {
        client: {
            host: '127.0.0.1',
            port: '3308',
            user: 'root',
            password: '123456',
            database: 'lotty',
        },
        app: true,
        agent: true
    }

};

module.exports = config;