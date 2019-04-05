/**
 *
 * 处理统计管理相关功能
 * auth: liyangli
 * date: 2019/4/6 上午12:25 .
 */
"use strict";
const Controller = require('egg').Controller;

class StatisticsController extends Controller {
    async findUserTotalDataMutation(){
        const {ctx}  = this;
        const { logger,service } = ctx;
        const respContent = {
            error_code: 0,
            msg: "",
            data: {}
        };
        
        // if(!user){
        //     respContent.error_code = 1;
        //     respContent.msg = "尚未登录，请先登录";
        //     ctx.body = respContent;
        //     return;
        // }
        //直接获取对应本月相关数据库
        const obj = await service.statisticsMng.findUserTotalDataMutation();
        respContent.data = obj;
        ctx.body = respContent;
        
    }
}


module.exports = StatisticsController;