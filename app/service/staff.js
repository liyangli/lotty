/**
 * Created by zting on 2019/4/17.
 */
"use strict";
const Service = require('egg').Service;
const moment = require("moment")
let tableName = "T_Base_User"
class StaffService extends Service{
    async search(params){
        const {app} = this;
        const {mysql,logger} = app;
        let totalSql = "select count(*) as total";
        let searchSql = "select * ";
        let sql = " from "+tableName+" where groupid=2 ";
        sql +=" order by reg_time desc ";
        totalSql +=  sql+";";
        searchSql += sql +" limit ?,? ;";
        let total = await mysql.query(totalSql);
        logger.info(`总共记录：${JSON.stringify(total)}`);
        if(total[0].total == 0){
            return {
                total: total[0].total,
                list: []
            }
        }
        let list = await mysql.query(searchSql,[parseInt((params.pageNo)-1)*parseInt(params.pageSize),parseInt(params.pageSize)]);
        return {
            total: total[0].total,
            list: list
        };
    }

    async update(params){
        const {app} = this;
        const {mysql,logger} = app;
        let sql = "update "+tableName+ " set username = ?,password = ?,telphone = ?,groupid = ?,reg_time = ?";
        let query = [params.username,params.password,params.telphone,params.groupid,params.reg_time];
        if(params.nickname){
            sql += ",nickname =?";
            query.push(params.nickname);
        }
        if(params.desc){
            sql += " ,`desc`= ?";
            query.push(params.desc);
        }

        sql += " where `id` = ?";
        query.push(params.id);
        return await mysql.query(sql,query);
    }

    async save(params){
        const {app} = this;
        const {mysql,logger} = app;
        let sql = "insert into "+tableName+" (username ,`password`,`telphone`,`groupid`,`reg_time`";
        let query = [params.username,params.password,params.telphone,params.groupid,moment(new Date()).format("YYYY-MM-DD HH:mm:ss")];
        let value = "(?,?,?,?,?";
        if(params.nickname){
            sql += ",`nickname`";
            query.push(params.nickname);
            value +=",?";
        }
        if(params.desc){
            sql += " ,`desc`";
            query.push(params.desc);
            value +=",?";
        }
        sql += ")  value "+value+")";
        return await mysql.query(sql,query);
    }

    async del(params){
        const {app} = this;
        const {mysql,logger} = app;
        let sql = "delete from  "+tableName+" where id = ?";
        return await mysql.query(sql,[params.id]);
    }

}

module.exports = StaffService;
