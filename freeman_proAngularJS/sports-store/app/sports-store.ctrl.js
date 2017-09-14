(function() {
  'use strict';

  angular
    .module('app')
    .constant('ROOT_URL', 'http://localhost:3000')
    .controller('SportsStoreCtrl', SportsStoreCtrl);

  SportsStoreCtrl.$inject = ['$scope', '$http', 'ROOT_URL'];
  function SportsStoreCtrl($scope, $http, ROOT_URL) {
    const vm = this;

    vm.data = {}

    $http
      .get(`${ROOT_URL}/products`)
      .then((res) => vm.data.products = res.data, (err) => vm.data.error = err.data);

  };
})();