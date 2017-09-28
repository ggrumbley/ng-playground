(function() {
  'use strict';

  angular
    .module('app.admin')
    .controller('AdminCtrl', AdminCtrl)
    .controller('AuthCtrl', AuthCtrl)
    .controller('OrdersCtrl', OrdersCtrl);

  function AdminCtrl(ROOT_URL) {
    var vm = this;

    vm.screens = ["Products", "Orders"];
    vm.current = vm.screens[0];

    vm.setScreen = (i) => vm.current = vm.screens[i];

    vm.getScreen = () => vm.current === "Products" ? "/app/admin/_admin-products.html" : "/app/admin/_admin-orders.html"
  }

  function AuthCtrl($http, $state) {
    var vm = this;


    // vm.authenticate = (user, pw) => {}
  }

  function OrdersCtrl($http, ROOT_URL) {
    const vm = this;
    $http
      .get(`${ROOT_URL}/orders`)
      .then((res) => vm.orders = res.data, (err) => vm.error = err.data);

    vm.selectedOrder;

    vm.selectOrder = (order) => vm.selectedOrder = order;

    vm.calcTotal = (order) => order.products.reduce((total, x) => total += x.count * x.price, 0);
  }

})();