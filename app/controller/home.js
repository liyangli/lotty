'use strict';

const Controller = require('egg').Controller;

class HomeController extends Controller {
  async index() {
    const { ctx } = this;
    const name = 'liyangli';
    ctx.body = 'hi, egg' + name;
  }
}

module.exports = HomeController;
