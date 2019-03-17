/* eslint valid-jsdoc: "off" */

'use strict';

/**
 * @param {Egg.EggAppInfo} appInfo app info
 */
const path = require("path");
const setting = require("../app/config/setting");
module.exports = appInfo => {
  const config = {
    static: {
      prefix: "/static/",
      dir: process.cwd() + "/dist/static/"
    },
    view: {
      root: path.join(process.cwd(), 'dist/'),
      defaultExtension: '.html',
      defaultViewEngine: 'ejs'
    },
    mysql: setting.mysql,
    security: {
      csrf: {
        enable: false,
      }
    }
  };

  // should change to your own
  config.keys = appInfo.name + '_1501478794929_754';

  // add your config here

  return config;
};

exports.logger = {
  level: 'DEBUG',
  consoleLevel: 'DEBUG'
};
