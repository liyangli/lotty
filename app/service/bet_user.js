/**
 *
 * auth: liyangli
 * date: 2019/3/17 下午12:43 .
 */
'use strict';
const Service = require('egg').Service;
const moment = require('moment');
const userBetsLink = 'T_User_Bets_Link';
class BetUserService extends Service {


  /**
     * 根据手机号进行查询对应bet对象。需要明确查询到该用户是否已经被添加了
     * @param telphone 手机号
     */
  async searchBetByTel(telphone) {
    const { app } = this;
    const { logger, mysql } = app;
    // 判断是否已经存在
    const sql = 'select bu.id id,bu.name name,bu.phone phone,bu.`nickname` nickname,link.userID userID from T_Bets_User bu left join T_User_Bets_Link link on bu.id = link.betID where bu.phone= ?';
    logger.info(`执行的sql预计为${sql},telphone:${telphone}`);
    const result = await mysql.query(sql, [ telphone ]);
    return result;
  }



  /**
   * 获取指定时间段内的统计数据；
   */
  async saveBetsStatistics(){
    const { app } = this;
    const { logger, mysql } = app;
    //获取当天日期
    console.info("当前时间："+moment().format("YYYY-MM-DD"));
    console.info("昨天时间："+moment().add(-1,'days').format("YYYY-MM-DD"));
    let beforeTime = moment().add(-1,'days').format("YYYY-MM-DD");

    let beginTime = moment().add(-1,'days').set('hour',0).set("minute",0).set("second",0).set("millisecond",0).valueOf();
    let endTime = moment().set('hour',0).set("minute",0).set("second",0).set("millisecond",0).valueOf();
    let sql = "insert into T_Bets_User_Statistics(amt,orderaftprizeamt,userID,betID,time) select nn.* from (select sum(amt) as amt,sum(`orderprizeamt`) as orderprizeamt,userID,betID,'"+beforeTime+"' from T_User_Order uo, T_User_Bets_Link ubl where uo.userno=ubl.betID and uo.createTime >="+beginTime+" and uo.createTime<"+endTime+"  group by ubl.betID) as nn";
    console.info("执行的sql:"+sql);
    const result = await mysql.query(sql);
    console.info(result);
    return result;
  }
  
  async saveLotoStatistics(){
    const { app } = this;
    const { logger, mysql } = app;
    let beforeTime = moment().add(-1,'days').format("YYYY-MM-DD");

    let beginTime = moment().add(-1,'days').set('hour',0).set("minute",0).set("second",0).set("millisecond",0).valueOf();
    let endTime = moment().set('hour',0).set("minute",0).set("second",0).set("millisecond",0).valueOf();
    let sql = "insert into T_Lotno_Statistics(amt,orderaftprizeamt,userID,lotno,time) select nn.* from (select sum(amt) as amt,sum(`orderprizeamt`) as orderprizeamt,userID,lotno,'"+beforeTime+"' from T_User_Order uo, T_User_Bets_Link ubl where uo.userno=ubl.betID and uo.createTime >="+beginTime+" and uo.createTime<"+endTime+"  group by uo.lotno) as nn";
    console.info("执行的sql:"+sql);
    const result = await mysql.query(sql);
    console.info(result);
    return result;
  }

  /**
     * 添加用户和彩民之间的关系
     * @param telphone 手机号
     * @param userID 用户ID
     */
  async add(betID, userID) {
    const { app } = this;
    const { logger, mysql } = app;
    const resp = {
      flag: false,
      msg: '写入数据库出现问题，请联系管理员',
      id: 0,
    };
    try {
      const result = await mysql.insert(userBetsLink, { betID, userID, reg_time: new Date().getTime() });
      if (result) {
        resp.flag = true;
        resp.id = result.insertId;
        resp.msg = '';
      } else{
        logger.error(`写入数据库失败，betID:${betID},userID:${userID};错误信息为：返回的result为null`);
      }

    } catch(e) {
      logger.error(`写入数据库失败，betID:${betID},userID:${userID};错误信息为：${e}`);
      resp.msg = '';
    }
    logger.info(resp);

    return resp;
  }


  /**
     * 查询指定用户下的所有的彩民数据
     * @param user
     */
  async search(user, pageNo, pageSize, searchAttr) {
    // 判断当前用户是否为超级用户，如果为超级用户则直接查询所有的数据；否则进行关联查询
    const groupID = user.groupid;
    if (groupID == 1) {
      return await this._adminSearch(pageNo, pageSize, searchAttr);
    }
    return await this._customerSearch(user.id, pageNo, pageSize, searchAttr);
  }


  async _adminSearch(pageNo, pageSize, searchAttr) {
    const { app } = this;
    const { mysql, logger } = app;
    let totalSql = 'select count(*) as total';
    let searchSql = 'select bu.*,bua.`balance` as balance,bua.`lastprizeamt` as lastprizeamt';
    let sql = ' from `T_Bets_User` bu, `T_Bets_User_Account` bua where  bu.id = bua.userno  ';
    if (searchAttr) {
      sql += " and ( name like '%" + searchAttr + "%' or phone like '%" + searchAttr + "%')";
    }
    sql += ' order by bu.registerDate desc';
    totalSql += sql + ';';
    searchSql += sql + ' limit ?,? ;';
    logger.info(`执行的sql：${totalSql.total}`);
    const total = await mysql.query(totalSql);
    logger.info(`总共记录：${JSON.stringify(total)}`);
    if (total[0].total == 0) {
      return {
        total: total[0].total,
        list: [],
      };
    }
    logger.info(`执行的sql：${searchSql},pageNo:${(pageNo - 1) * pageSize},pageSize: ${pageSize}`);
    const list = await mysql.query(searchSql, [ (parseInt(pageNo) - 1) * parseInt(pageSize), parseInt(pageSize) ]);
    return {
      total: total[0].total,
      list,
    };

  }

  async _customerSearch(userID, pageNo, pageSize, searchAttr) {
    const { app } = this;
    const { mysql, logger } = app;
    let totalSql = 'select count(*) as total ';
    let searchSql = 'select bu.*,bua.`balance` as balance,bua.`lastprizeamt` as lastprizeamt';
    let sql = ' from `T_Bets_User` bu, `T_Bets_User_Account` bua , T_User_Bets_Link link where  bu.id =	bua.userno and bu.id = link.`betID` and link.userID= ? ';
    if (searchAttr) {
      sql += " and ( name like '%" + searchAttr + "%' or phone like '%" + searchAttr + "%')";
    }
    sql += ' order by bu.registerDate desc ';
    totalSql += sql;
    searchSql += sql + ' limit ?,? ';
    logger.info(`执行的sql：${totalSql}`);
    const total = await mysql.query(totalSql, [ parseInt(userID) ]);
    logger.info(`总共记录：${total[0].total}`);
    if (total[0].total == 0) {
      return {
        total: total[0].total,
        list: [],
      };
    }
    logger.info(`执行的sql：${searchSql},userID:${userID},pageNo:${pageNo},pageSize: ${pageSize}`);
    const list = await mysql.query(searchSql, [ parseInt(userID), (parseInt(pageNo) - 1) * parseInt(pageSize), parseInt(pageSize) ]);
    return {
      total: total[0].total,
      list,
    };
  }
}

module.exports = BetUserService;
