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

    /**
     * 获取分页用户数据
     */
    async findStatistics(userID,startDate,endDate,tableName,start,pageSize){
        let countSql = "select count(*) as ct " ;
        let sql = "from "+tableName+" as tn,T_Bets_User bu where tn.betID=bu.id and time >= '"+startDate+"' and time <= '"+endDate+"' and userID="+userID;
        let pageSql = "select tn.*,bu.nickName as nickname,bu.username as username ";
        pageSql += sql;
        pageSql += " limit "+start+","+pageSize;
        const {app} = this;
        const {mysql,logger} = app;
        let countObj = await mysql.query(countSql+sql);
        let total = countObj[0].ct;
        let list = await mysql.query(pageSql);
        return {
            total: total,
            list: list
        }
        
    }

    async totalBetsUserAmt(userID,startDate,endDate){
        let sql = "select sum(amt) as amt,sum(orderaftprizeamt) as orderaftprizeamt from T_Bets_User_Statistics where time>='"+startDate+"' and time<='"+endDate+"' and userID = "+userID;
        const {app} = this;
        const {mysql,logger} = app;
        let list = await mysql.query(sql);
        if(!list || list.length == 0){
            return {
                amt: 0,
                orderaftprizeamt: 0
            }
        }
        return {
            amt: list[0].amt,
            orderaftprizeamt: list[0].orderaftprizeamt
        }
    }


    async findLotnoAmt(){
        const {app} = this;
        const {mysql,logger} = app;
        let sql = "select sum(amt) as amt from T_Lotno_Statistics";
        let amtSum = await mysql.query(sql);
        return amtSum[0].amt;
    }
    
}

module.exports = StatisticsMngService;
