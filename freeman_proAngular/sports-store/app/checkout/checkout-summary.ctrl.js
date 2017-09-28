(function() {
  'use strict';

  angular
    .module('app')
    .controller('CartSummaryController', CartSummaryController);

  CartSummaryController.$inject = ['CartService'];
  function CartSummaryController(CartService) {
    var vm = this;

    vm.cartData = CartService.getProducts();

    vm.total = () => vm.cartData.reduce((total, i) => total += (i.price * i.count, 0));

    vm.remove = (id) => CartService.removeProduct(id);
  }
})();