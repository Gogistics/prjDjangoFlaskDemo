(function($){
  /*
    calling order:
    1. app.config()
    2. app.run()
    3. directive's compile functions (if they are found in the dom)
    4. app.controller()
    5. directive's link functions (again, if found)
  */

  angular.element(document.body).ready(function(){
    // bootstrap App
    angular.bootstrap(document.body, ['indexApp']);
  });

  // init App
  initApp();

  function initApp(){

    // set module
    window.indexApp = window.indexApp || angular.module('indexApp', ['ngRoute'], function($locationProvider, $interpolateProvider){

      // change interploate to avoid conflicts when template engines use {{...}}
      $interpolateProvider.startSymbol('[[');
      $interpolateProvider.endSymbol(']]');
    });

    // global values
    window.indexApp.value('APP_VALUES', {
      EMAIL: 'gogistics@gogistics-tw.com',
      BINARY_STREAM: null,
      FINGERPRINT: null
    });

    window.indexApp.config(function($routeProvider, $compileProvider){
      // $compileProvider.debugInfoEnabled(false); // for production

      // routing config is usually done here
      $routeProvider.when("/section-1", {
                        templateUrl : "my_ng_templates/section-1.html"
                    })
                    .when("/section-2", {
                        templateUrl : "my_ng_templates/section-2.html"
                    })
                    .when("/section-3", {
                        templateUrl : "my_ng_templates/section-3.html"
                    })
                    .otherwise({redirectTo: '/section-1'});
    });

    window.indexApp.run(function($window){
      // enable socket
      var protocol = $window.location.protocol, host = $window.location.host, my_url = protocol + '//' + host + '/test';
      console.log(my_url);
      window.socket = io.connect(my_url); // set connection

      window.socket.on('connect', function() {
        window.socket.emit('my_event', {data: 'emitted event from client!'});
      });
      window.socket.on('disconnect', function(msg) {
        console.log(msg);
        window.socket.emit('my_event', {data: 'disconnect'});
      });
      window.socket.on('my_response', function(msg) {
        console.log(msg);
      });
    });

    // services of serving $http
    window.indexApp.service('dataProvider', function($http, APP_VALUES){
      this.getData = function(arg_url, arg_headers, arg_data){
        return $http({
           url: arg_url,
           method: 'POST',
           data: arg_data,
           headers: arg_headers
        });
      }
    });

    window.indexApp.directive('tooltip', function($window) {
        return {
            restrict: 'AE',
            link: function(scope, elem) {
                var tooltipSpan, x, y, top_elem, left_elem;
               //Find the element which will contain tooltip-span
                tooltipSpan = elem[0].querySelector('span#tooltip-span');
                
                //Bind mousemove event to the element which will show tooltip
                elem.mousemove(function(e) {
                    //find X & Y coodrinates
                    x = e.clientX,
                    y = e.clientY;
                    top_elem = elem[0].getBoundingClientRect().top;
                    left_elem = elem[0].getBoundingClientRect().left;
                    
                    //Set tooltip position according to mouse position
                    tooltipSpan.style.top = (y - top_elem + 20) + 'px';
                    tooltipSpan.style.left = (left_elem - x * 0.1) + 'px';
                });
                   
            }
        };
    });

    // watcher controller which handle everything inside watcher scope
    window.indexApp.controller('indexCtrl', ['$scope', '$window', 'APP_VALUES', 'dataProvider', function($scope, $window, APP_VALUES, dataProvider){
      // set variables and functions of ctrl
      var ctrl = this;
      ctrl.init = function(){
        console.log('init...');
      };

      // resize listener for data visualization
      var w = angular.element($window);
      ctrl.getWindowDimensions = function () {
          return {
              'h': w.height(),
              'w': w.width()
          };
      };
      $scope.$watch(ctrl.getWindowDimensions, function (newValue, oldValue) {
        ctrl.windowHeight = newValue.h;
        ctrl.windowWidth = newValue.w;

        $scope.style = function () {
            return {
              'height': (newValue.h - 100) + 'px',
              'width': (newValue.w - 100) + 'px'
            };
        };
      }, true);

      w.bind('resize', function () {
        $scope.$apply();
      });
    }]);
  };
})(jQuery);
