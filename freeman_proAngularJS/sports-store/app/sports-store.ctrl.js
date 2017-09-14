(function() {
  "use strict";

  angular
    .module("app")
    .constant("ROOT_URL", "http://localhost:3000")
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
      let order = angular.copy(shippingDetails);
      order.products = CartService.getProducts();
      console.log(order);
      $http.post(`${ROOT_URL}/orders`).then((res) => console.log(res.data))
      // $http.post(`${ROOT_URL}/orders`).then(res => {
      //   console.log(res.data)
      //   // vm.data.orderId = res.data.id;
      //   // CartService.getProducts().length = 0;
      // }, err => (vm.data.orderError = err.data))
      // // .then(() => $state.go('complete'));
    };
  }
})();
