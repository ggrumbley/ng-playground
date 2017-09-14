(function() {
  "use strict";

  angular.module("app.admin").controller("ProductCtrl", ProductCtrl);

  function ProductCtrl($resource, ROOT_URL) {
    var vm = this;

    vm.productsResource = $resource(
      `${ROOT_URL}/products/:id`,
      { id: "@id" },
      {
        update: { method: "PUT" }
      }
    );

    vm.listProducts = () => (vm.products = vm.productsResource.query());

    vm.deleteProduct = product => {
      product
        .$delete()
        .then(() => vm.products.splice(vm.products.indexOf(product), 1));
    };

    vm.createProduct = product => {
      new vm.productsResource(product).$save().then(newProduct => {
        vm.products.push(newProduct);
        vm.editedProduct = null;
      });
    };

    vm.updateProduct = product => {
      product.$update();
      vm.editedProduct = null;
    };

    vm.startEdit = product => (vm.editedProduct = product);

    vm.cancelEdit = () => (vm.editedProduct = null);

    vm.listProducts();
  }
})();
