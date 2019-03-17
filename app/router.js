'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;
  router.post('/login', controller.home.login);
  router.post('/validUserHave', controller.home.validUserHave);
  router.post('/register', controller.home.register);

};
