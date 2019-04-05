/**
 *
 * 彩票用户控制器
 * auth: liyangli
 * date: 2019/3/17 下午12:40 .
 */
"use strict";
const Controller = require('egg').Controller;

class BetUserController extends Controller {

    async add(){
        const {ctx} = this;
        const {logger} = ctx;
        const respContent = {
            error_code: 0,
            msg: "",
            data: {}
        };
        //从session中获取用户是否已经登录，没有登录进行提示需要先进行登录；
        const user = ctx.session.user;
        if(!user){
            respContent.error_code = 1;
            respContent.msg = "尚未登录，请先执行登录操作";
            ctx.body = respContent;
            return;
        }
        const params = ctx.request.body;
        let telphone = params.telphone;
        if(!telphone){
            respContent.error_code = 1;
            respContent.msg = "手机号不允许为空";
            ctx.body = respContent;
            return;
        }
        //开始查找手机号是否存在。不存在时返回错误信息
        let result = await ctx.service.betUser.searchBetByTel(telphone);
        if(!result || result.length == 0){
            respContent.error_code = 1;
            respContent.msg = "添加的手机号不存在；请确认手机号";
            ctx.body = respContent;
            return;
        }
        let betUser = result[0];
        let userID = betUser.userID;
        if(userID){
            respContent.error_code = 1;
            respContent.msg = "该手机号已经绑定了其他用户，请确认手机号，或者联系管理员";
            ctx.body = respContent;
            return;
        }
        //开始进行执行保存动作
        let betUserResp = await ctx.service.betUser.add(betUser.id,user.id);
        logger.info("获取到的数据为："+JSON.stringify(betUserResp));
        if(!betUserResp.flag){
            respContent.error_code = 1;
            respContent.msg = betUserResp.msg;
            ctx.body = respContent;
            return;
        }
        respContent.data = {
            id: betUserResp.id
        };
        ctx.body = respContent;

    }

    /**
     * 查询具体彩票用户，根据登录用户进行查询。如果该用户为管理员则直接查询所有的数据。否则只查询关联数据
     */
    async search(){
        const {ctx} = this;
        const { service ,logger } = ctx;
        let params = ctx.request.body;
        let pageNo = params.pageNo;
        let pageSize = params.pageSize;
        let searchAttr = params.searchAttr;
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
        const user = ctx.session.user;
        if(!user){
            respContent.error_code = 1;
            respContent.msg = "尚未登录，请先登录";
            ctx.body = respContent;
            return;
        }
        
        try{
            respContent.data  = await ctx.service.betUser.search(user,pageNo,pageSize,searchAttr);
        }catch(e){
            logger.error(`获取数据出错了，错误信息为:${e}`);
        }
        ctx.body = respContent;
        
    }
}
module.exports = BetUserController;