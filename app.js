(function() {
    'use strict';

    angular.module('NarrowItDownApp', [])
        .controller('NarrowItDownController', NarrowItDownController)
        .service('MenuSearchService', MenuSearchService)
        .constant('ApiBasePath', "http://davids-restaurant.herokuapp.com")
        .directive('foundItems', foundItemsDirective);

    NarrowItDownController.$inject = ['MenuSearchService'];

    function NarrowItDownController(MenuSearchService) {
        var search = this;

        search.getMatchedMenuItems = function(searchTerm) {

            var promise = MenuSearchService.getMatchedMenuItems(searchTerm);

            promise.then(function(response) {
                    search.foundItemsList = response;
                })
                .catch(function(error) {
                    console.log("Something went terribly wrong.");
                });
        };


        search.removeItem = function(itemIndex) {
            MenuSearchService.removeItem(itemIndex);
        };

    }

    MenuSearchService.$inject = ['$http', 'ApiBasePath'];

    function MenuSearchService($http, ApiBasePath) {
        var service = this;
        var localItems;

        service.getMatchedMenuItems = function(searchTerm) {
            return $http({
                method: "GET",
                url: (ApiBasePath + "/menu_items.json")
            }).then(function(response) {
                var foundItems = [];
                var items = response.data.menu_items;
                for (var i = 0; i < items.length; i++) {
                    var name = items[i].name;
                    if (name.toLowerCase().indexOf(searchTerm) !== -1) {
                        foundItems.push(items[i]);
                    }
                }
                localItems = foundItems;
                return foundItems;
            });
        };

        service.removeItem = function(itemIndex) {
            localItems.splice(itemIndex, 1);
        };

    }

    function foundItemsDirective() {
        var ddo = {
            templateUrl: 'foundList.html',
            scope: {
                items: '<',
                onRemove: '&'
            },
            controller: FoundItemsDirectiveController,
            controllerAs: 'found',
            bindToController: true
        };

        return ddo;
    }


    function FoundItemsDirectiveController() {
        var found = this;

        found.checkListEmpty = function() {
            if (found.items != undefined && found.items.length < 1) {
                return true;
            }
            return false;
        };
    }

})();
