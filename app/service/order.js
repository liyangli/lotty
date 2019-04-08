/**
 *
 * 订单管理服务
 * auth: liyangli
 * date: 2019/3/17 下午3:19 .
 */
"use strict";
const Service = require('egg').Service;
let TYPETABLE = {
    "1": "T_User_No_Ticket_Order",
    "2": "T_User_Order",
    "3": "T_User_Cancel_Order"
}
class OrderService extends Service{
    /**
     * 搜索用户信息
     * @param user 用户对象
     * @param pageNo 当前页
     * @param pageSize 页大小
     */
    async search(user,pageNo,pageSize,flag,lotno){
        let groupID = user.groupid;
        //如果lotno存在，则查询所有的子集订单信息；
        let ids = [];
        if(lotno){
            //通过递归方式执行查询所有子集
            if (typeof(lotno) == "string"){
                ids = lotno.split(",");
            }else{
                ids.push(lotno);
            }
           
            await this._searchSunOrderTypes(ids);
        }
        if (groupID == 1) {
            return await this._adminSearch(pageNo, pageSize,flag,ids);
        }
        return await this._customerSearch(user.id,pageNo,pageSize,flag,ids);

    }
    
    async _searchSunOrderTypes(ids){
        const {app} = this;
        const {mysql,logger} = app;
        let sql = "select id from T_Order_Type where pid in (";

        let flag = false;
        for(let i in ids){
            let id = ids[i];
            if(flag){
                sql += ",";
            }else{
                flag = true;
            }
            sql += "'"+id+"'";
        }
        sql += ")";
        let list = await mysql.query(sql,[ids]);
        if(!list || list.length == 0){
            return ids;
        }
        //判断是否list中元素在ids中都含有了
        // for()
        let finishFlag = true;
        for(let obj of list){
            let flag = false;
            for(let id of ids){
                if(obj.id == id){
                    flag = true;
                    break;
                }
            }
            if(flag){
                continue;
            }
            ids.push(obj.id);
            finishFlag = false;
        }
        if(finishFlag){
            return;
        }
        await this._searchSunOrderTypes(ids)
    }

    async _adminSearch(pageNo,pageSize,flag,ids){
        const {app} = this;
        const {mysql,logger} = app;
        let totalSql = "select count(*) as total";
        let searchSql = "select * ";
        let tableName = TYPETABLE[flag];
        let sql = " from "+tableName+" where 1=1 ";
        if(ids.length> 0){

            sql += " and lotno in (";
            let flag = false;
            for(let id of ids){
                if(flag){
                    sql += ",";
                }else{
                    flag = true;
                }
                sql += "'"+id+"'";
            }
            sql += ")";
        }
        sql +=" order by createtime desc ";
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
        let list = await mysql.query(searchSql,[parseInt((pageNo)-1)*parseInt(pageSize),parseInt(pageSize)]);
        return {
            total: total[0].total,
            list: list
        };

    }

    async _customerSearch(userID,pageNo,pageSize,flag,ids){
        const {app} = this;
        const {mysql,logger} = app;
        let totalSql = "select count(*) as total ";
        let searchSql = "select uo.*";
        let tableName = TYPETABLE[flag];
        let sql = " from "+tableName+" as uo,T_User_Bets_Link as link where uo.userno = link.betID and link.userID=?";
        if(ids.length> 0){

            sql += " and uo.lotno in (";
            let flag = false;
            for(let id of ids){
                if(flag){
                    sql += ",";
                }else{
                    flag = true;
                }
                sql += "'"+id+"'";
            }
            sql += ")";
        }
        sql += " order by createtime desc";
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
        let list = await mysql.query(searchSql,[parseInt(userID),(parseInt(pageNo)-1)*parseInt(pageSize),parseInt(pageSize)]);
        return {
            total: total[0].total,
            list: list
        };
    }
    
    async findType(){
        const {app} = this;
        const {mysql,logger} = app;
        let sql = "select * from T_Order_Type";
        let list = await mysql.query(sql,[]);
        return list
    }
}

module.exports = OrderService;
