/**
 *
 * auth: liyangli
 * date: 2019/4/6 上午12:33 .
 */
"use strict";

const Service = require('egg').Service;
const moment = require('moment');
class StatisticsMngService extends Service{
    async findUserTotalDataMutation(userID){
        const {app} = this;
        const {mysql,logger} = app;
        //处理方式，根据数据直接查询t_bets_user_link表中数据，判断注册周期是否在指定时间之内即可；
        //获取月初时间；
        
        let dayTime = moment().startOf('day').valueOf();
        let monthTime = moment().startOf('month').valueOf();
        let weekTime = moment().startOf('week').valueOf();
        let sql = "select reg_time from T_User_Bets_Link where userID="+userID ;
        let list = await mysql.query(sql);
        let content = {
            "monthNum": 0,
            "todayNum": 0,
            "totalResult": list.length,
            "weekNum": 0
        };
        
        for(let i in list){
            let obj = list[i];
            let reg_time = obj.reg_time;
            if(reg_time >= dayTime){
                content.todayNum += 1;
            }
            if(reg_time >= weekTime){
                content.weekNum += 1;
            }
            if(reg_time >= monthTime){
                content.monthNum += 1;
            }

        }
        return content;
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


    async findLotnoStatistics(userID,startDate,endDate,start,pageSize){
        let countSql = "select count(*) as ct " ;
        let sql = "from  T_Lotno_Statistics as tn where  time >= '"+startDate+"' and time <= '"+endDate+"' and userID="+userID;
        let pageSql = "select tn.* ";
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

    async findLotnoAmt(userID,startDate,endDate){
        const {app} = this;
        const {mysql,logger} = app;
        let sql = "select sum(amt) as amt from T_Lotno_Statistics where time >= '"+startDate+"' and time <= '"+endDate+"' and userID="+userID;
        let amtSum = await mysql.query(sql);
        return amtSum[0].amt;
    }
    
}

module.exports = StatisticsMngService;
