(function() {
  'use strict';

  angular
    .module('app.admin')
    .controller('AdminCtrl', AdminCtrl);

  AdminCtrl.$inject = ['dependency1'];
  function AdminCtrl(dependency1) {
    var vm = this;

  }
})();