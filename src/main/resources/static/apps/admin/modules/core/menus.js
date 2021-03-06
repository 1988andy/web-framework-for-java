app.controller('MenusCtrl',
    [ '$scope', '$http', '$mdSelect', 'appService', 'appDialog',
    function($scope, $http, $mdSelect, appService, appDialog) {

        function initData() {
            $scope.selectedMenuTemplate = null;
            appDialog.loading();

            appService.ajaxAll(
                appService.ajaxGet('/api/core/menus/templates'),
                appService.ajaxGet('/api/core/menus/tree?all=true')
            ).then(function(values) {
                $scope.menuTemplates = values[0];
                $scope.menus = values[1];
            }).finally(function() {
                appDialog.loading(false);
            });
        }

        $scope.add = function(parent) {
            angular.resetForm($scope.form);
            if (parent) {
                $scope.formModel = { parentId: parent.id, visible: true };
            } else {
                $scope.formModel = { visible: true };
            }
            $('#dialogForm').modal('show');
        };

        $scope.edit = function(menu) {
            angular.resetForm($scope.form);
            $scope.formModel = angular.copy(menu);
            $('#dialogForm').modal('show');
        };

        $scope.save = function() {
            if ($scope.formModel.id) {
                $http.put('/api/core/menus/' + $scope.formModel.id, $scope.formModel).then(function() {
                    $('#dialogForm').modal('hide');
                    appDialog.success();
                    initData();
                });
            } else {
                $http.post('/api/core/menus', $scope.formModel).then(function() {
                    $('#dialogForm').modal('hide');
                    appDialog.success();
                    initData();
                });
            }
        };

        $scope.toggleVisible = function(menu) {
            $http.put('/api/core/menus/' + menu.id + '/toggleVisible').then(function() {
                appDialog.success();
                initData();
            });
        };

        $scope.remove = function(menu) {
            appDialog.confirmDeletion(function() {
                $http.delete('/api/core/menus/' + menu.id).then(function() {
                    appDialog.success();
                    initData();
                });
            });
        };

        $scope.selectMenuTemplate = function() {
            if ($scope.selectedMenuTemplate) {
                $scope.formModel.name = $scope.selectedMenuTemplate.name;
                $scope.formModel.link = $scope.selectedMenuTemplate.link;
            }
        };

        $scope.closeDialog = function() {
            $mdSelect.hide();
            $scope.selectedMenuTemplate = null;
        };

        initData();
    }]
);