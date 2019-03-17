/**
 *
 * auth: liyangli
 * date: 2019/3/17 下午12:43 .
 */
"use strict";
const Service = require('egg').Service;
const userBetsLink = "T_User_Bets_Link";
class BetUserService extends Service{


    /**
     * 根据手机号进行查询对应bet对象。需要明确查询到该用户是否已经被添加了
     * @param telphone 手机号
     */
    async searchBetByTel(telphone){
        const {app} = this;
        const {logger,mysql} = app;
        //判断是否已经存在
        let sql = "select bu.id id,bu.name name,bu.phone phone,bu.`nickname` nickname,link.userID userID from T_Bets_User bu left join T_User_Bets_Link link on bu.id = link.betID where bu.phone= ?";
        logger.info(`执行的sql预计为${sql},telphone:${telphone}`);
        let result = await mysql.query(sql,[telphone]);
        return result;
    }

    /**
     * 添加用户和彩民之间的关系
     * @param telphone 手机号
     * @param userID 用户ID
     */
    async add(betID,userID){
        const { app } = this;
        const {logger,mysql} = app;
        let resp = {
            flag: false,
            msg : "写入数据库出现问题，请联系管理员",
            id: 0
        }
        try{
            let result = await mysql.insert(userBetsLink,{betID: betID,userID:userID});
            if(result){
                resp.flag = true;
                resp.id = result.insertId;
                resp.msg = "";
            }else{
                logger.error(`写入数据库失败，betID:${betID},userID:${userID};错误信息为：返回的result为null`);
            }

        }catch(e){
            logger.error(`写入数据库失败，betID:${betID},userID:${userID};错误信息为：${e}`);
            resp.msg = "";
        }
        logger.info(resp);

        return resp;
    }


    /**
     * 查询指定用户下的所有的彩民数据
     * @param user
     */
    async search(user,pageNo,pageSize) {
        //判断当前用户是否为超级用户，如果为超级用户则直接查询所有的数据；否则进行关联查询
        let groupID = user.groupid;
        if (groupID == 1) {
            return await this._adminSearch(pageNo, pageSize);
        }
        return await this._customerSearch(user.id,pageNo,pageSize);
    }



    async _adminSearch(pageNo,pageSize){
        const {app} = this;
        const {mysql,logger} = app;
        let totalSql = "select count(*) as total";
        let searchSql = "select bu.*,bua.`balance` as balance,bua.`lastprizeamt` as lastprizeamt";
        let sql = " from `T_Bets_User` bu, `T_Bets_User_Account` bua where  bu.id = bua.userno order by bu.registerDate desc ";
        totalSql +=  sql+";";
        searchSql += sql +" limit ?,? ;";
        logger.info(`执行的sql：${totalSql.total}`);
        let total = await mysql.query(totalSql);
        logger.info(`总共记录：${JSON.stringify(total)}`);
        if(total[0].total == 0){
            return {
                total: total[0].total,
                list: []
            }
        }
        logger.info(`执行的sql：${searchSql},pageNo:${(pageNo-1)*pageSize},pageSize: ${pageSize}`);
        let list = await mysql.query(searchSql,[(parseInt(pageNo)-1)*parseInt(pageSize),parseInt(pageSize)]);
        return {
            total: total[0].total,
            list: list
        };

    }

    async _customerSearch(userID,pageNo,pageSize){
        const {app} = this;
        const {mysql,logger} = app;
        let totalSql = "select count(*) as total ";
        let searchSql = "select bu.*,bua.`balance` as balance,bua.`lastprizeamt` as lastprizeamt";
        let sql = " from `T_Bets_User` bu, `T_Bets_User_Account` bua , T_User_Bets_Link link where  bu.id =	bua.userno and bu.id = link.`betID` and link.userID= ? order by bu.registerDate desc ";
        totalSql +=  sql;
        searchSql += sql +" limit ?,? ";
        logger.info(`执行的sql：${totalSql}`);
        let total = await mysql.query(totalSql,[parseInt(userID)]);
        logger.info(`总共记录：${total[0].total}`);
        if(total[0].total == 0){
            return {
                total: total[0].total,
                list: []
            }
        }
        logger.info(`执行的sql：${searchSql},userID:${userID},pageNo:${pageNo},pageSize: ${pageSize}`);
        let list = await mysql.query(searchSql,[parseInt(userID),(parseInt(pageNo)-1)*parseInt(pageSize),parseInt(pageSize)]);
        return {
            total: total[0].total,
            list: list
        };
    }
}

module.exports = BetUserService;
