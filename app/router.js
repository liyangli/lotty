'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;
  router.post('/login', controller.home.login);
  router.post('/validUserHave', controller.home.validUserHave);
  router.post('/register', controller.home.register);
  
  //用户管理，添加关联
  router.post('/betUser/add', controller.betUser.add);
  router.post('/betUser/search', controller.betUser.search);

  //订单管理
  router.post('/order/search', controller.order.search);
  router.get('/order/findType', controller.order.findType);


};
