/**
 * Created by zting on 2019/4/17.
 */
"use strict";
const Controller = require('egg').Controller;

class StaffController extends Controller {
    async search(){
        const {ctx} = this;
        console.info("i am in controller search method......");
        const { logger,service } = ctx;
        const params = ctx.request.body;
        const respContent = {
            error_code: 0,
            msg: "",
            data: {}
        };

        try{
            respContent.data = await service.staff.search(params);
        }catch(e){
            logger.error(`获取数据出错了，错误信息为:${e}`);
        }
        ctx.body = respContent;
    }

    async edit(){
        const {ctx} = this;
        const {logger} = ctx;
        const respContent = {
            error_code: 0,
            msg: "成功",
            data: {}
        };
        const params = ctx.request.body;
        let resp;
        //开始进行执行保存动作
        if(params.id){
            //执行保存动作
            resp = await ctx.service.staff.update(params);
        }else{
            //执行更新动作
            resp = await ctx.service.staff.save(params);
        }


        logger.info(resp.affectedRows)
        if(!resp.affectedRows == 1){
            respContent.error_code = 1;
            respContent.msg = "失败";
        }
        ctx.body = respContent;
    }
    
    async del(){
        const {ctx} = this;
        const {logger} = ctx;
        const params = ctx.request.body;
        const respContent = {
            error_code: 0,
            msg: "成功",
            data: {}
        };
        const resp = await ctx.service.staff.del(params);
        if(!resp.affectedRows == 1){
            respContent.error_code = 1;
            respContent.msg = "失败";
        }
        ctx.body = respContent;
    }
}

module.exports = StaffController;
