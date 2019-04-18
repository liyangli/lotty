'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;
  router.post('/api/login', controller.home.login);
  router.post('/api/validUserHave', controller.home.validUserHave);
  router.post('/api/register', controller.home.register);
  
  //用户管理，添加关联
  router.post('/api/betUser/add', controller.betUser.add);
  router.post('/api/betUser/search', controller.betUser.search);

  //员工管理
  router.post('/api/staff/edit', controller.staff.edit);
  router.post('/api/staff/search', controller.staff.search);
  router.post('/api/staff/del', controller.staff.del);

  //订单管理
  router.post('/api/order/search', controller.order.search);
  router.get('/api/order/findType', controller.order.findType);

  //统计管理
  router.post('/api/statistics/findUserTotalDataMutation', controller.statistics.findUserTotalDataMutation);
  router.post('/api/betUser/statistics', controller.statistics.findBetUser);
  router.post('/api/lotno/statistics', controller.statistics.findLotno);


};
