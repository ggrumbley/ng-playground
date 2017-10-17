(function(angular) {
  "use strict";

  function EditableFieldController($scope, $element, $attrs) {
    var vm = this;
    vm.editMode = false;

    vm.handleModeChange = function() {
      if (vm.editMode) {
        vm.onUpdate({ value: vm.fieldValue });
        vm.fieldValueCopy = vm.fieldValue;
      }
      vm.editMode = !vm.editMode;
    };

    vm.reset = function() {
      vm.fieldValue = vm.fieldValueCopy;
    };

    vm.$onInit = function() {
      // Make a copy of the initial value to be able to reset it later
      vm.fieldValueCopy = vm.fieldValue;

      // Set a default fieldType
      if (!vm.fieldType) {
        vm.fieldType = "text";
      }
    };
  }

  angular.module("heroApp").component("editableField", {
    templateUrl: "./components/editableField.html",
    controller: EditableFieldController,
    controllerAs: 'vm',
    bindings: {
      fieldValue: "<",
      fieldType: "@?",
      onUpdate: "&"
    }
  });
})(window.angular);
