(function() {
  'use strict';

  angular
    .module('app')
    .constant("PRODUCT_LIST_ACTIVE_CLASS", "btn-primary")
    .constant("PRODUCT_LIST_PAGE_COUNT", 3)
    .controller('ProductListCtrl', ProductListCtrl);

  ProductListCtrl.$inject = ['$scope', '$filter', 'PRODUCT_LIST_ACTIVE_CLASS', 'PRODUCT_LIST_PAGE_COUNT', 'CartService'];
  function ProductListCtrl($scope, $filter, PRODUCT_LIST_ACTIVE_CLASS, PRODUCT_LIST_PAGE_COUNT, CartService) {
    var vm = this;

    let selectedCategory = null;

    vm.selectedPage = 1;
    vm.pageSize = PRODUCT_LIST_PAGE_COUNT;

    vm.selectCategory = (newCategory) => {
      selectedCategory = newCategory;
      vm.selectedPage = 1;
    }

    vm.selectPage = (newPage) => vm.selectedPage = newPage;

    vm.categoryFilterFn = (product) => !selectedCategory || product.category === selectedCategory;

    vm.getCategoryClass = (category) => selectedCategory === category ? PRODUCT_LIST_ACTIVE_CLASS : "";

    vm.getPageClass = (page) => vm.selectedPage === page ? PRODUCT_LIST_ACTIVE_CLASS : "";

    vm.addProductToCart = (product) => CartService.addProduct(product.id, product.name, product.price);
  }
})();