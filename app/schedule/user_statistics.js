/**
 *
 * 用户统计，每天执行统计上一天数据；
 * auth: liyangli
 * date: 2019/4/17 上午1:16 .
 */
'use strict';
const Subscription = require('egg').Subscription;
class UserStatistics extends Subscription {
  static get schedule() {
    return {
      cron: '0 10 0 * * *',
      // interval: '10s',
      type: 'all'
    };
  }
  async subscribe() {
    // 开始执行具体的任务，主要进行开始统计相关用户信息；
    /**
     * 统计处理步骤：
     * 1、获取统计数据；
     * 2、把统计数据进行入库操作
     */
    await this.ctx.service.betUser.saveBetsStatistics();
    await this.ctx.service.betUser.saveLotoStatistics();
  }
  
}

module.exports = UserStatistics;
