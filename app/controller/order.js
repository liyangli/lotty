/**
 *
 * 订单管理类
 * auth: liyangli
 * date: 2019/3/17 下午3:15 .
 */
"use strict";
const Controller = require('egg').Controller;

class OrderController extends Controller {
    async search(){
        const {ctx} = this;
        const { logger,service } = ctx;
        const params = ctx.request.body;
        let pageNo = params.pageNo;
        let pageSize = params.pageSize;
        let flag = params.flag;
        const respContent = {
            error_code: 0,
            msg: "",
            data: {}
        };
        if(!pageNo || pageNo < 0){
            respContent.error_code = 1;
            respContent.msg = "pageNo必须为大于0的整数";
            ctx.body = respContent;
            return;
        }
        if(!pageSize || pageSize < 0){
            respContent.error_code = 1;
            respContent.msg = "pageSize必须为大于0的整数";
            ctx.body = respContent;
            return;
        }
        if(!flag || flag < 0 ){
            respContent.error_code = 1;
            respContent.msg = "没有设置类型";
            ctx.body = respContent;
            return;
        }

        const user = ctx.session.user;
        if(!user){
            respContent.error_code = 1;
            respContent.msg = "尚未登录，请先登录";
            ctx.body = respContent;
            return;
        }

        try{
            let list = await service.order.search(user,pageNo,pageSize,flag);
            respContent.data = list;
        }catch(e){
            logger.error(`获取数据出错了，错误信息为:${e}`);
        }
        ctx.body = respContent;
    }
}

module.exports = OrderController;
