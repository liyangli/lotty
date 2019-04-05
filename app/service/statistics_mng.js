/**
 *
 * auth: liyangli
 * date: 2019/4/6 上午12:33 .
 */
"use strict";

const Service = require('egg').Service;
class StatisticsMngService extends Service{
    async findUserTotalDataMutation(){
        const {app} = this;
        const {mysql,logger} = app;
        let searchSql = "select * from T_User_Statistics";
        logger.info(searchSql);
        let list = await mysql.query(searchSql);
        return list[0];
    }
}

module.exports = StatisticsMngService;
