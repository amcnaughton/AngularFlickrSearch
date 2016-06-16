angular.module('flickrSearch', ['ngMessages'])
    .controller('flickrController', ['$scope', '$http', function($scope, $http) {

        var vm = this;

        // user has clicked the search button
        vm.search = function() {

            // setup for Flickr API
            var url = 'https://api.flickr.com/services/rest';
            var api_key = 'f13178908b08b06c7a8715b0b4f48e10';
            var params = {
                method: 'flickr.photos.search',
                api_key: api_key,
                tags: vm.keywords,
                format: 'json',
                nojsoncallback: 1
            };

            // save copy of keywords
            vm.savedKeywords = vm.keywords;

            // notify user we're searching...
            vm.messageType = 'search';

            // ping Flickr for the data
            $http({
                    url: url,
                    method: 'GET',
                    params: params
                })
                .then(function(response) { // success

                        vm.photos = response.data.photos.photo;
                        vm.total = response.data.photos.total;

                        // display results summary
                        vm.messageType = 'results';

                        // reset the Angular form
                        if ($scope.search)
                            $scope.search.$setPristine();

                        // clear input field
                        vm.keywords = '';
                    },
                    function(response) { // failure

                        vm.messageType = 'error';
                    });
        }

    }]);