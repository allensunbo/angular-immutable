// we want to detect element value changes in an array, $watchCollection does not work for this case,
// so we have to resort to $watch with objectEquality == true. This will cause performance.
// Using immutable.js helps us in this scenario!

angular.module('App', [])
    .constant('LEN', 10000)
    .factory('items', function(LEN) {
        var items = [];
        for (var i = 0; i < LEN; i++) {
            items.push({
                value: i
            });
        }
        return items;
    })
    .controller('MainCtrl', function($scope, items, LEN) {
        var vm = this;
        vm.items = angular.copy(items);
        $scope.$watch(function() {
            return vm.items;
        }, function(newVal, oldVal) {
            if (newVal) {
                console.log(vm.items[LEN / 2].value);
                vm.mid = vm.items[LEN / 2].value;
            }
        }, true);

        vm.updateItem = function() {
            vm.items[LEN / 2].value = vm.newItem;
        }
    })
    .controller('SecondCtrl', function($scope, items, LEN) {
        var vm = this;
        vm.items = Immutable.List(angular.copy(items));

        $scope.$watch(function() {
            return vm.items;
        }, function(newVal, oldVal) {
            if (newVal) {
                console.log(vm.items.get(LEN / 2).value);
                vm.mid = vm.items.get(LEN / 2).value;
            }
        }, false);

        vm.updateItem = function() {
            vm.items = vm.items.splice(LEN / 2, 1, {
                value: vm.newItem
            });
        }
    });
