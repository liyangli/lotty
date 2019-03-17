/**
 *
 * 订单管理服务
 * auth: liyangli
 * date: 2019/3/17 下午3:19 .
 */
"use strict";
const Service = require('egg').Service;
class OrderService extends Service{
    /**
     * 搜索用户信息
     * @param user 用户对象
     * @param pageNo 当前页
     * @param pageSize 页大小
     */
    async search(user,pageNo,pageSize,flag){
        let groupID = user.groupid;
        if (groupID == 1) {
            return await this._adminSearch(pageNo, pageSize,flag);
        }
        return await this._customerSearch(user.id,pageNo,pageSize,flag);

    }

    async _adminSearch(pageNo,pageSize,flag){
        const {app} = this;
        const {mysql,logger} = app;
        let totalSql = "select count(*) as total";
        let searchSql = "select * ";
        let sql = " from T_User_Order where flag=? order by createtime desc ";
        totalSql +=  sql+";";
        searchSql += sql +" limit ?,? ;";
        let total = await mysql.query(totalSql,[parseInt(flag)]);
        logger.info(`总共记录：${JSON.stringify(total)}`);
        if(total[0].total == 0){
            return {
                total: total[0].total,
                list: []
            }
        }
        logger.info(`执行的sql：${searchSql},pageNo:${(pageNo-1)*pageSize},pageSize: ${pageSize}`);
        let list = await mysql.query(searchSql,[parseInt(flag),parseInt((pageNo)-1)*parseInt(pageSize),parseInt(pageSize)]);
        return {
            total: total[0].total,
            list: list
        };

    }

    async _customerSearch(userID,pageNo,pageSize,flag){
        const {app} = this;
        const {mysql,logger} = app;
        let totalSql = "select count(*) as total ";
        let searchSql = "select uo.*";
        let sql = " from T_User_Order as uo,T_User_Bets_Link as link where uo.userno = link.betID and link.userID=? and flag=? order by createtime desc";
        totalSql +=  sql;
        searchSql += sql +" limit ?,? ";
        let total = await mysql.query(totalSql,[parseInt(userID),parseInt(flag)]);
        logger.info(`总共记录：${total[0].total}`);
        if(total[0].total == 0){
            return {
                total: total[0].total,
                list: []
            }
        }
        logger.info(`执行的sql：${searchSql},userID:${userID},pageNo:${pageNo},pageSize: ${pageSize}`);
        let list = await mysql.query(searchSql,[parseInt(userID),parseInt(flag),(parseInt(pageNo)-1)*parseInt(pageSize),parseInt(pageSize)]);
        return {
            total: total[0].total,
            list: list
        };
    }
}

module.exports = OrderService;
