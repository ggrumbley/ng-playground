(function() {
    angular.module('dashboardAnalysisApp').controller('confirmationModalCtrl', function($uibModalInstance) {
        var vm = this;

        vm.confirm = function() {
            $uibModalInstance.close(true);
        };

        vm.cancel = function() {
            $uibModalInstance.dismiss('cancel');
        };
    });
})();
