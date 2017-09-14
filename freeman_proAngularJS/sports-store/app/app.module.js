(function() {
  "use strict";

  angular
    .module("app", ["customFilters", "app.cart", "ui.router"])
    .config(configFunc);

  function configFunc($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise("/products");
    // $locationProvider.html5Mode(true);

    $stateProvider
      .state("checkout", {
        url: "/checkout",
        templateUrl: "./app/checkout/_checkout-summary.html"
      })
      .state("products", {
        url: "/products",
        templateUrl: "./app/product-list/_product-list.html"
      })
      .state("complete", {
        url: "/complete",
        templateUrl: "./app/shared/_thank-you.html"
      })
      .state("placeorder", {
        url: "/placeorder",
        templateUrl: "./app/shared/_place-order.html"
      })
  }
})();
