angular.module('flickrSearch', ['ngMessages'])
    .controller('flickrController', ['flickrService', function(flickrService) {

        var vm = this;

        // user has clicked the search button
        vm.search = function(searchForm) {

            // save copy of keywords
            vm.savedKeywords = vm.keywords;

            // notify user we're searching...
            vm.messageType = 'search';

            // get the photos
            flickrService.getPhotos(vm.keywords)
                .then(function(res) {
                        // update model 
                        vm.messageType = 'results';
                        vm.photos = res.photos;
                        vm.total = res.total;

                        // reset the form
                        if (searchForm)
                            searchForm.$setPristine();

                        // clear input field
                        vm.keywords = '';
                    },
                    function(error) {
                        vm.messageType = 'error';
                    });
        }

    }])
    .factory('flickrService', ['$http', function($http) {

        return {

            getPhotos: function(keywords) {

                // setup for Flickr API
                var url = 'https://api.flickr.com/services/rest';
                var api_key = 'f13178908b08b06c7a8715b0b4f48e10';
                var params = {
                    method: 'flickr.photos.search',
                    api_key: api_key,
                    tags: keywords,
                    format: 'json',
                    nojsoncallback: 1
                };

                // ping Flickr
                return $http({
                        url: url,
                        method: 'GET',
                        params: params
                    })
                    .then(function(res) {
                            // success
                            return {
                                photos: res.data.photos.photo,
                                total: res.data.photos.total
                            }
                        },
                        function(httpError) {
                            // http failure
                            throw httpError.status + " : " +
                                httpError.data;
                        });
            }
        }

    }]);