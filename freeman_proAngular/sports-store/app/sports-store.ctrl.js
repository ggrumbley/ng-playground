(function() {
  "use strict";

  angular
    .module("app")
    .controller("SportsStoreCtrl", SportsStoreCtrl);

  SportsStoreCtrl.$inject = [
    "$scope",
    "$http",
    "$state",
    "ROOT_URL",
    "CartService"
  ];
  function SportsStoreCtrl($scope, $http, $state, ROOT_URL, CartService) {
    const vm = this;

    vm.data = {};

    $http
      .get(`${ROOT_URL}/products`)
      .then(
        res => (vm.data.products = res.data),
        err => (vm.data.error = err.data)
      );

    vm.sendOrder = shippingDetails => {
      let order = { ...shippingDetails };
      order.products = CartService.getProducts();

      $http
        .post(`${ROOT_URL}/orders`, order)
        .then(res => {
          vm.data.orderId = res.data.id;
          CartService.getProducts().length = 0;
        }, err => (vm.data.orderError = err.data))
        .then(() => $state.go("complete"));
    };
  }
})();
