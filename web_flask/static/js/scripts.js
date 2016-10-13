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
      FINGERPRINT: null,
      REAL_TIME_DATA: []
    });

    window.indexApp.config(function($routeProvider, $compileProvider){
      // $compileProvider.debugInfoEnabled(false); // for production

      // routing config is usually done here
      $routeProvider.when("/realtime-chart", {
                        templateUrl : "my_ng_templates/section-1.html"
                    })
                    .when("/section-2", {
                        templateUrl : "my_ng_templates/section-2.html"
                    })
                    .when("/section-3", {
                        templateUrl : "my_ng_templates/section-3.html"
                    })
                    .otherwise({redirectTo: '/realtime-chart'});
    });

    window.indexApp.run(function($window, APP_VALUES){
      // enable socket
      var protocol = $window.location.protocol, host = $window.location.host, my_url = protocol + '//' + host + '/test';
      $window.socket = io.connect(my_url); // set connection

      $window.socket.on('connect', function() {
        $window.socket.emit('my_event', {data: 'emitted event from client!'});
      });
      $window.socket.on('disconnect', function(msg) {
        console.log(msg);
        $window.socket.emit('my_event', {data: 'disconnect'});
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
        $scope.$apply(); // update all scopes including root and child scopes
      });
    }]);

    window.indexApp.controller('realtimeChartCtrl', ['$scope', '$window', 'APP_VALUES', 'dataProvider', function($scope, $window, APP_VALUES, dataProvider){
      // set variables and functions of ctrl
      var ctrl = this;
      ctrl.init = function(){
        console.log('init realtime chart section...');
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
        $scope.$digest(); // use $digest() instead of $apply()
      });

      // realtime chart
      // obtain real-time data
      $window.socket.on('my_realtime_data', function(msg) {
        APP_VALUES.REAL_TIME_DATA.push(msg);
        if(APP_VALUES.REAL_TIME_DATA.length > 1000) APP_VALUES.REAL_TIME_DATA.shift();
      });

      ctrl.initRealtimeChart = function(){
        var n = 245,
            duration = 700,
            now = new Date(Date.now() - duration),
            data = d3.range(n).map(function(){return 0;}); // default values for chart; here all are set to zero

        var margin = {top: 5, right: 0, bottom:20, left: 50},
            width = 680 - margin.left,
            height = 150 - margin.top - margin.bottom;

        var x = d3.time.scale()
                  .domain([now - (n - 2) * duration, now - duration])
                  .range([0, width]);

        var y = d3.scale.linear()
                      .domain([0, 11]) // range of y axis
                      .range([height, 0]);

        var line = d3.svg.line()
                    .interpolate('basis')
                    .x(function(d, i){ return x(now - (n - 1 - i) * duration); })
                    .y(function(d, i){ return y(d); });

        var svg = d3.select('div#realtimeChart')
                    .append('svg')
                    .attr('width', width + margin.left + margin.right)
                    .attr('height', height + margin.top + margin.bottom)
                    .style('margin-left', -margin.left + 'px')
                    .append('g')
                    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');
        svg.append('defs')
          .append('clipPath')
          .attr('id', 'clip')
          .append('rect')
          .attr('width', width)
          .attr('height', height);

        var xAxis = svg.append('g')
                      .attr('class', 'x axis')
                      .attr('transform', 'translate(0,' + height + ')')
                      .call(x.axis = d3.svg.axis().scale(x).orient("bottom"));
        var yAxis = svg.append('g')
                      .attr('class', 'y axis')
                      .call(d3.svg.axis().scale(y).orient('left').ticks(5).tickFormat(d3.format('d')));
        var path = svg.append('g')
                      .attr('clip-path', 'url(#clip)')
                      .append('path')
                      .datum(data)
                      .attr('class', 'line');
        var transition = d3.select({})
                          .transition()
                          .duration(750)
                          .ease('linear');

        function buildYAxis(){
          return d3.svg.axis().scale(y).orient('left').ticks(10);
        }

        svg.append('svg:g')
          .attr('class', 'grid')
          .call(buildYAxis().tickSize(-width, 0, 0).tickFormat(''));

        svg.append('text')
          .attr('class', 'label')
          .attr('transform', 'rotate(-90)')
          .attr('y', -40)
          .attr('x', 0 - (height / 2) - 20)
          .attr('dy', '1em')
          .style('font-size', '13px')
          .text('Values');

        (function tick(){
          transition = transition.each(function(){
            now = new Date();
            x.domain([now - (n - 2) * duration, now - duration]);
            y.domain([0, 11]);


            // incomplete
            var currentVal = APP_VALUES.REAL_TIME_DATA.shift() || {random_number: 0};
            data.push(currentVal['random_number']);
            
            svg.select('.line')
              .attr('d', line)
              .attr('transform', null);

            xAxis.call(x.axis); // slide the x-axis left
            path.transition().attr('transform', 'translate(' + x(now - (n - 1) * duration) + ')'); // slide the line left

            data.shift();
          }).transition().each('start', tick);
        })();
        
      };
      ctrl.initRealtimeChart();
    }]);

    // ctrl of responsive donuts chart
    window.indexApp.controller('donutsChartCtrl', ['$scope', '$window', 'APP_VALUES', 'dataProvider', function($scope, $window, APP_VALUES, dataProvider){
      var ctrl = this;
      ctrl.init = function(){
        console.log('init donutsChartCtrl...');
        ctrl.charts = [[12,34,6], [7,31,6], [8,24,6], [2,30,5,29]];
      };

      angular.element($window).on('resize', function(){
        $scope.$digest(); // use $digest instead of $apply to only update the specific scope
      });
    }]);
    // end of ctrl of responsive donuts chart

    // donut chart directive
    window.indexApp.directive('donutChart', function($window){
      function link(scope, el){
        var myWindow = angular.element($window);
        var data = scope.data,
          color = d3.scale.category10(),
          el = el[0],
          width = myWindow.width() * 0.2,
          height = myWindow.height() * 0.4,
          min = Math.min(width, height),
          pie = d3.layout.pie().sort(null),
          arc = d3.svg.arc()
                  .outerRadius(min / 2 * 0.9)
                  .innerRadius(min / 2 * 0.5),
          svg = d3.select(el).append('svg');
        var g = svg.append('g');
        var arcs = g.selectAll('path');

        svg.on('mousedown', function(){
          scope.$apply(function(){
            var num = Math.round(Math.random()* 10) + 1
            scope.data = d3.range(num).map(Math.random)
          })
        });

        function arcTween(a) {
          // see: http://bl.ocks.org/mbostock/1346410
          var i = d3.interpolate(this._current, a);
          this._current = i(0);
          return function(t) {
            return arc(i(t));
          };
        }

        scope.$watch('data', function(data){
          var duration = 1000
          arcs = arcs.data(pie(data))
          arcs.transition()
            .duration(duration)
            .attrTween('d', arcTween)
          
          arcs.enter()
            .append('path')
            .style('stroke', 'white')
            .attr('fill', function(d, i){ return color(i) })
            .each(function(d) {
              this._current = { startAngle: 2 * Math.PI - 0.001, endAngle: 2 * Math.PI }
            })
            .transition()
            .duration(duration)
            .attrTween('d', arcTween)
          
          arcs.exit()
            .transition()
            .duration(duration)
            .each(function(d){ 
              d.startAngle = 2 * Math.PI - 0.001; d.endAngle = 2 * Math.PI; 
            })
            .attrTween('d', arcTween).remove();
        })

        scope.$watch(function(){
          return myWindow.width() * myWindow.height();
        }, function(){
          width = myWindow.width() * 0.2;
          height = myWindow.height() * 0.4;
          min = Math.min(width, height);
          arc.outerRadius(min / 2 * 0.9).innerRadius(min / 2 * 0.5);
          svg.attr({width: width, height: height});
          g.attr('transform', 'translate(' + (width / 2) + ',' + (height / 2) + ')');
          arcs.attr('d', arc);
        });
      };
      return {link: link, restrict: 'AE', scope: {data: '='}};
    });
    // end of donut chart directive

  };
})(jQuery);
