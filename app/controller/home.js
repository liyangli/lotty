'use strict';

const Controller = require('egg').Controller;

class HomeController extends Controller {
  /**
   * 登录方法，判断是否登录成功；成功后进行获取用户基本信息；
   */
  async login() {
    const respContent = {
      error_code: 0,
      msg: "",
      data: []
    };
    const { ctx } = this;
    const param = ctx.request.body;
    const username = param.username;
    const password = param.password;

    const userFlag = this._isEmpty(username);
    if(userFlag){
       respContent.error_code = 1;
       respContent.msg = "用户名不允许为空";
       ctx.body = respContent;
       return;
    }
    const passwordFlag = this._isEmpty(password);
    if(passwordFlag){
      respContent.error_code = 1;
      respContent.msg = "密码不允许为空";
      ctx.body = respContent;
      return;
    }

    //开始真正查询动作
    const user = await ctx.service.home.login(username,password);
    if(!user){
      respContent.error_code = 1;
      respContent.msg = "用户或密码输入不正确，请重新输入";
      ctx.body = respContent;
      return;
    }
    //成功后进行保存到session中
    ctx.session.user = user;
    respContent.data = user;
    ctx.body = respContent;
  }

  /**
   * 验证用户是否存在
   */
  async validUserHave(){
    const respContent = {
      error_code: 0,
      msg: "",
      data: []
    };
    const { ctx } = this;
    const params =  ctx.request.body;
    let username = params.username;
    const userFlag = this._isEmpty(username);
    if(userFlag){
      respContent.error_code = 1;
      respContent.msg = "用户名不允许为空";
      ctx.body = respContent;
      return;
    }
    const flag = await ctx.service.home.validUserHave(username);
    respContent.data = {
      flag: flag
    };
    ctx.body = respContent;
  }

  async register(){
    const respContent = {
      error_code: 0,
      msg: "",
      data: []
    };
    const {ctx} = this;
    const params = ctx.request.body;
    let username = params.username;
    const userFlag = this._isEmpty(username);
    if(userFlag){
      respContent.error_code = 1;
      respContent.msg = "用户名不允许为空";
      ctx.body = respContent;
      return;
    }
    let password = params.password;
    const passwordFlag = this._isEmpty(password);
    if(passwordFlag){
      respContent.error_code = 1;
      respContent.msg = "密码不允许为空";
      ctx.body = respContent;
      return;
    }
    let nickname = params.nickname;
    let telphone = params.telphone;
    ctx.logger.info("telphone:"+telphone);
    if(!telphone){
      respContent.error_code = 1;
      respContent.msg = "手机号不允许为空";
      ctx.body = respContent;
      return;
    }
    //先检测具体用户是否存在，如果存在不允许添加；
    const flag = await ctx.service.home.validUserHave(username);
    if(flag){
      respContent.error_code = 1;
      respContent.msg = "用户名已经存在，请重新设置";
      ctx.body = respContent;
      return;
    }
    let result = await ctx.service.home.register(username,password,nickname,telphone);
    let registFlag = result.flag;
    if(!registFlag){
      respContent.error_code = 1;
      respContent.msg = result.msg;
      ctx.body = respContent;
      return;
    }
    respContent.data = {
      id: result.id
    };
    ctx.body = respContent;
  }


  _isEmpty(param){
    if(!param || param == ""){
      return true;
    }
    return false;
  }

}

module.exports = HomeController;
