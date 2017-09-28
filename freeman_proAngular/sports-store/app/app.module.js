(function() {
  "use strict";

  angular
    .module("app", ["customFilters", "app.cart", "app.admin", "ui.router"])
    .constant("ROOT_URL", "http://localhost:3000")
    .config(configFunc);

  function configFunc($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise("/products");
    // $locationProvider.html5Mode(true);

    $stateProvider
      .state("checkout", {
        url: "/checkout",
        views: {
          'header': {
            templateUrl: "./app/shared/_header.html"
          },
          'content': {
            templateUrl: "./app/checkout/_checkout-summary.html"
          }
        }
      })
      .state("products", {
        url: "/products",
        views: {
          'header': {
            templateUrl: "./app/shared/_header.html"
          },
          'content': {
            templateUrl: "./app/product-list/_product-list.html"
          }
        }
      })
      .state("complete", {
        url: "/complete",
        views: {
          'header': {
            templateUrl: "./app/shared/_header.html"
          },
          'content': {
            templateUrl: "./app/shared/_thank-you.html"
          }
        }
      })
      .state("placeorder", {
        url: "/placeorder",
        views: {
          'header': {
            templateUrl: "./app/shared/_header.html"
          },
          'content': {
            templateUrl: "./app/shared/_place-order.html"
          }
        }
      })
      .state("admin", {
        url: '/admin',
        views: {
          'content': {
            templateUrl: "./app/admin/_admin.html"
          }
        }
      })
      .state("login", {
        url: '/admin/login',
        views: {
          'content': {
            templateUrl: "./app/admin/_login.html"
          }
        }
      })

  }
})();
