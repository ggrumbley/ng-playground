(function(angular) {
  'use strict';
function HeroDetailController() {
  var vm = this;

  vm.delete = function() {
    vm.onDelete({hero: vm.hero});
  };

  vm.update = function(prop, value) {
    vm.onUpdate({hero: vm.hero, prop: prop, value: value});
  };
}

angular.module('heroApp').component('heroDetail', {
  templateUrl: './components/heroDetail.html',
  controller: HeroDetailController,
  controllerAs: 'vm',
  bindings: {
    hero: '<',
    onDelete: '&',
    onUpdate: '&'
  }
});
})(window.angular);