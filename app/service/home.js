/**
 *
 * auth: liyangli
 * date: 2019/3/15 下午11:16 .
 */
"use strict";
const Service = require('egg').Service;
const baseUser = "T_Base_User";
class HomeService extends Service{

    /**
     * 登录验证
     * 1、进行跟进用户名、密码查询数据库中数据；
     * 2、返回具体对象
     * @param username 用户名
     * @param password 密码
     */
    async login(username,password){
        const { app } = this;
        
        //处理步骤
        const user = await app.mysql.get(baseUser,{username:username,password:password});
        return user;
    }

    /**
     * 查询用户名是否已经出在哪
     * @param username 用户名
     * @return true:已经含有，false:尚未添加
     */
    async validUserHave(username){
        const {app} = this;
        const user = await app.mysql.get(baseUser,{username:username});
        const logger = app.logger;
        logger.info(user);
        if(!user){
            return false;
        }
        return true;
    }

    /**
     * 注册方法
     * @param username 用户名
     * @param password 密码
     * @param nickname 匿名
     * @param telphone 电话
     */
    async register(username,password,nickname,telphone) {
        //执行保存动作
        const {app} = this;
        const {logger} = app;
        logger.info("开始执行register方法");
        logger.info(`username:${username},password:${password},nickname:${nickname},telphone:${telphone}`);
        let nowTime = new Date().getTime();
        let obj = {
            flag: false,
            err: "注册失败，请联系管理员",
            id: 0
        };
        try{
            const result = await app.mysql.insert(baseUser, {
                username: username, password: password, nickname: nickname,
                telphone: telphone, reg_time: nowTime, groupid: 2
            });
            if(result && result.insertId > 0){
                obj.flag = true;
                obj.msg = "";
                obj.id = result.insertId;
            }else{
                logger.error(`写入数据库失败，没有返回具体结果，请检查数据。请求参数为：username:${username},password:${password},nickname:${nickname},telphone:${telphone},reg_time:${nowTime}`);
            }
            
        }catch(e){
            logger.error(`写入数据库失败，没有返回具体结果，请检查数据。请求参数为：username:${username},password:${password},nickname:${nickname},telphone:${telphone},reg_time:${nowTime}；错误信息为：`+e);
        }
        
        return obj;
    }
}   


module.exports = HomeService;
