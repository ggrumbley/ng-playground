(function(angular) {
  'use strict';
function HeroListController($scope, $element, $attrs) {
  var vm = this;

  // This would be loaded by $http etc.
  vm.list = [
    {
      name: 'Superman',
      location: ''
    },
    {
      name: 'Batman',
      location: 'Wayne Manor'
    },
    {
      name: 'Bob Dole',
      location: 'Korean Penninsula'
    },
    {
      name: 'Gary',
      location: 'San Diego'
    }
  ];

  vm.updateHero = function(hero, prop, value) {
    hero[prop] = value;
  };

  vm.deleteHero = function(hero) {
    var idx = vm.list.indexOf(hero);
    if (idx >= 0) {
      vm.list.splice(idx, 1);
    }
  };
}

angular.module('heroApp').component('heroList', {
  templateUrl: './components/heroList.html',
  controller: HeroListController,
  controllerAs: 'vm'
});
})(window.angular);