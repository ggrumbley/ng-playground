(function() {
  "use strict";

  angular
    .module("app.admin", ["ui.router", "ngResource"])
    .config(configFunc);


  function configFunc($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise("/login");

    $stateProvider
      .state("admin", {
        url: '/admin',
        templateUrl: "./app/admin/admin.html"
      })
      .state("login", {
        url: '/login',
        parent: "admin",
        templateUrl: "./app/admin/_login.html"
      })
  };

})();
