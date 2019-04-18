/**
 * Created by 2017 on 2017/12/15.
 */
"use strict";
let config = {
    mysql: {
        client: {
            host: '39.100.40.74',
            port: '27460',
            user: 'root',
            password: '123456',
            database: 'lotty',
            timeout:1000000000,
            connectTimeout:1000000000,
        },
        // client: {
        //     host: '127.0.0.1',
        //     port: '3308',
        //     user: 'root',
        //     password: '123456',
        //     database: 'lotty',
        //     timeout:1000000000,
        //     connectTimeout:1000000000,
        // },
        app: true,
        agent: true
    }

};

module.exports = config;