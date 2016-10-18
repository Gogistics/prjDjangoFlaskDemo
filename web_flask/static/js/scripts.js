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

    window.indexApp.config(function($routeProvider, $compileProvider, $provide){
      // $compileProvider.debugInfoEnabled(false); // for production

      // routing config is usually done here
      $routeProvider.when("/realtime-chart", {
                        templateUrl : "my_ng_templates/section-1.html"
                    })
                    .when("/donut-charts", {
                        templateUrl : "my_ng_templates/section-2.html"
                    })
                    .when("/animation", {
                        templateUrl : "my_ng_templates/section-3.html"
                    })
                    .otherwise({redirectTo: '/realtime-chart'});

      // decorator
      $provide.decorator('myFactory', function($delegate){
        $delegate.reverse = function(){
          // decorate setData()
          $delegate.setData($delegate.getData().split('').reverse().join(''));
        };
        return $delegate;
      });
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

    // factories
    window.indexApp.factory('myFactory', function(){
      var myStr = 'init data';
      var addToStr = function(newStr){
        myStr += newStr;
      };
      return {getData: function(){
                  return myStr;
                },
              setData: function(data){
                  myStr = data;
                },
              addData: addToStr};
    });

    // directives
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
        console.log('init indexCtrl');
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
        console.log('init realtimeChartCtrl');
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
      
      ctrl.ringtone = new Audio('/static/sounds/ringtone_2.mp3'); // play ringtone while random number is bigger than 8
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
                  .domain([0, 11])
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
            if(currentVal['random_number'] > 8){
              console.log('Number: ' + currentVal['random_number']);
              ctrl.ringtone.play(); // better to implement the alert with debouncing
            }
            data.push(currentVal['random_number']);
            
            svg.select('.line')
              .attr('d', line)
              .attr('transform', null);

            xAxis.call(x.axis); // slide the x-axis left
            path.transition().attr('transform', 'translate(' + x(now - (n - 1) * duration) + ')'); // slide the line left

            data.shift(); // remove the oldest data
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

      /* donut chart with slider */
      var τ = Math.PI; // http://tauday.com/tau-manifesto
      var arc = d3.svg.arc()
          .innerRadius(250)
          .outerRadius(0)
          .startAngle(0);

      // Draw the thing!
      drawBadge("#candidscore");
      updateScore(50, "#candidscore");

      // Pass DOM selector to function, set up Canvas size
      function drawBadge(svgID) {
        var width = 500,
          height = 500,
          aspect = width / height;

        // Create the SVG container, and apply a transform such that the origin is the
        // center of the canvas. This way, we don't need to position arcs individually.
        var svg = d3.select(svgID)
            .attr("preserveAspectRatio", "xMidYMid")
            .attr("viewBox", "0 0 500 500")
            .attr("width", "100%")
            .attr("height", "100%")
            .append("g")
            .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")")

        // Add the background arc, from 0 to 100% (τ).
        var background = svg.append("path")
            .datum({endAngle: 2*τ})
            .style("fill", "#f2f2f2")
            .attr("transform", "rotate(-90)")
            .attr("d", arc);

        // Add the top arc in orange
        var foreground_top = svg.append("path")
            .attr("id", "foreground_top")
            .datum({endAngle: 0 * τ})
            .style("fill", "#fab923")
            .attr("d", arc)
            .attr("transform", "rotate(-90)");

        // Add bottom arc in orange
        var foreground_bottom = svg.append("path")
            .attr("id", "foreground_bottom")
            .datum({endAngle: 0 * -τ })
            .style("fill", "#fab923")
            .attr("d", arc)
            .attr("transform", "rotate(-90)");

        var trans_circ = svg.append("circle")
            .attr("cx", 0)
            .attr("cy", 0)
            .attr("r", 210)
            .attr("fill", "rgba(255,255,255, .25)");

        // Create "def" element that will contain our drop shadow filter
        var defs = svg.append("defs");

        // Create our filter with an id of "#drop-shadow"
        var filter = defs.append("filter")
          .attr("id", "drop-shadow")
          .attr("height", "130%");

        // Create our Gaussian Blur with a standard deviation of 8
        filter.append("feGaussianBlur")
          .attr("in", "SourceAlpha")
          .attr("stdDeviation", 8)
          .attr("result", "blur");

        // Translate the output of Gaussian Blur to (0,0), and store result in var offsetBlur
        filter.append("feOffset")
          .attr("in", "blur")
          .attr("dx", 0)
          .attr("dy", 0)
          .attr("result", "offsetBlur");


        // Control the opacity of the actual drop shadow with 'feComponentTransfer and SLOPE'
        var comptransf = filter.append("feComponentTransfer");

        comptransf.append("feFuncA")
                  .attr("type", "linear")
                  .attr("slope", .2);

        // Overlay original SourceGraphic over translated blurred opacity by using feMerge filter ***ORDER IS IMPORTANT***
        var feMerge = filter.append("feMerge");

        feMerge.append("feMergeNode")
        feMerge.append("feMergeNode")
          .attr("in", "SourceGraphic");
    

        var white_circ = svg.append("circle")
            .attr("cx", 0)
            .attr("cx", 0)
            .attr("r", 180)
            .attr("id", "white_circ")
            .style("filter", "url(#drop-shadow)")
            .attr("fill", "white");
         
        var stroke_circ = svg.append("circle")
            .attr("cx", 0)
            .attr("cy", 0)
            .attr("r", 160)
            .attr("fill", "none")
            .attr("stroke", "rgba(0,0,0,.125")
            .attr("stroke-width", "1px");

        // draw logo
        var candidlogo = svg.append("g").attr("transform", "translate(-295,-285), scale(1.75)");

          candidlogo.append("path")
              .attr("d", "M134.3,233.2L134.3,233.2c0-3.3,2.6-6.2,6-6.2c2.2,0,3.6,1,4.7,2.2l-0.8,0.8c-1-1-2.2-1.9-3.9-1.9c-2.7,0-4.7,2.2-4.7,5v0c0,2.8,2.1,5.1,4.8,5.1c1.7,0,2.9-0.9,3.9-2l0.8,0.7c-1.2,1.4-2.6,2.3-4.8,2.3 C136.9,239.3,134.3,236.5,134.3,233.2z" )
              .attr("fill", "#A7A8AD");
          candidlogo.append("path")
                    .attr("d", "M147.3,235.6L147.3,235.6c0-2.5,2.1-3.9,5.1-3.9c1.6,0,2.8,0.2,3.9,0.5v-0.5c0-2.4-1.4-3.6-3.9-3.6 c-1.4,0-2.6,0.4-3.7,0.9l-0.4-1c1.3-0.6,2.6-1,4.2-1c1.6,0,2.8,0.4,3.7,1.3c0.8,0.8,1.2,1.9,1.2,3.3v7.3h-1.1v-2 c-0.8,1.1-2.3,2.2-4.5,2.2C149.6,239.3,147.3,238,147.3,235.6z M156.3,234.6v-1.3c-1-0.3-2.3-0.5-4-0.5c-2.5,0-3.9,1.1-3.9,2.7v0 c0,1.7,1.6,2.7,3.4,2.7C154.2,238.2,156.3,236.8,156.3,234.6z" )
                    .attr("fill", "#A7A8AD");
          candidlogo.append("path")
                    .attr("d", "M161.4,227.3h1.1v2.2c0.8-1.4,2.1-2.5,4.2-2.5c3,0,4.7,2,4.7,4.8v7.2h-1.1v-7c0-2.4-1.4-4-3.7-4 c-2.3,0-4.1,1.7-4.1,4.2v6.8h-1.1V227.3z")
                    .attr("fill", "#A7A8AD");
          candidlogo.append("path")
                    .attr("d", "M174.7,233.2L174.7,233.2c0-3.9,2.9-6.2,5.7-6.2c2.3,0,3.9,1.3,4.8,2.8v-7.6h1.1V239h-1.1v-2.6 c-1,1.5-2.5,2.9-4.8,2.9C177.6,239.3,174.7,237,174.7,233.2z M185.3,233.2L185.3,233.2c0-3.1-2.3-5.1-4.8-5.1 c-2.6,0-4.6,1.9-4.6,5v0c0,3.1,2.1,5.1,4.6,5.1C183,238.2,185.3,236.2,185.3,233.2z")
                    .attr("fill", "#A7A8AD");
          candidlogo.append("path")
                    .attr("d", "M190.7,222.7h1.4v1.5h-1.4V222.7z M190.8,227.3h1.1V239h-1.1V227.3z")
                    .attr("fill", "#A7A8AD");
          candidlogo.append("path")
                    .attr("d", "M195.6,233.2L195.6,233.2c0-3.9,2.9-6.2,5.7-6.2c2.3,0,3.9,1.3,4.8,2.8v-7.6h1.1V239h-1.1v-2.6 c-1,1.5-2.5,2.9-4.8,2.9C198.5,239.3,195.6,237,195.6,233.2z M206.2,233.2L206.2,233.2c0-3.1-2.3-5.1-4.8-5.1 c-2.6,0-4.6,1.9-4.6,5v0c0,3.1,2.1,5.1,4.6,5.1C203.9,238.2,206.2,236.2,206.2,233.2z")
                    .attr("fill", "#A7A8AD");

        var text_score = svg.append("text")
          .attr("id", "scorenum")
          .attr("x", 0)
          .attr("y", 60)
          .attr("font-family", "proxima nova")
          .attr("text-anchor", "middle")
          .attr("font-weight", "bold")
          .attr("font-size", 195)
          .attr("fill", "#555555");
      }

      function arcTweenTwo(transition, newAngle) {
        transition.attrTween("d", function(d) {
          var interpolate = d3.interpolate(d.endAngle, newAngle);
          return function(t) {
            d.endAngle = interpolate(t);
            return arc(d);
          };
        });
      }

      function updateScore(score, svgID) {
        console.log(score);
        var decimalized = score / 100.0;
        console.log(decimalized);
        var our_svg = d3.select(svgID);
        var foreground_top = our_svg.select("path#foreground_top");
        var scorenum = our_svg.select("text#scorenum");
        var foreground_bottom = our_svg.select("path#foreground_bottom");
        scorenum.text(score);

        foreground_top.transition()
            .duration(1500)
            .ease("elastic")
            .call(arcTweenTwo, decimalized * τ );
        foreground_bottom.transition()
            .duration(1500)
            .ease("elastic")
            .call(arcTweenTwo, decimalized * -τ );
      }

      angular.element( "div#slider" ).slider({
        start: 50,
        min: 1,
        max: 100,
        value: 50,
        slide: function( event, ui ) {
          updateScore(ui.value, "#candidscore");
        }
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
          width = myWindow.width() * 0.15,
          height = myWindow.height() * 0.3,
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
            var num = Math.round(Math.random()* 10) + 1;
            scope.data = d3.range(num).map(Math.random);
          })
        });

        function arcTween(a) {
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
        });

        scope.$watch(function(){
          return myWindow.width() * myWindow.height();
        }, function(){
          width = myWindow.width() * 0.15;
          height = myWindow.height() * 0.3;
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

    // decoratorCtrl
    window.indexApp.controller('animationCtrl', ['$scope', 'myFactory', function($scope, myFactory){
      var ctrl = this;

      // decorator example
      console.log(myFactory.getData());
      myFactory.addData(' + hello decortaor');
      myFactory.reverse();
      console.log(myFactory.getData());

      /* my-animation: Example 1. */
      var width = 500,
          height = 500;

      var svg = d3.select("my-animation").append("svg")
          .attr("width", width)
          .attr("height", height)
          .append("g")
          .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

      var gradient = svg.append("defs").append("linearGradient")
          .attr("id", "gradient")
          .attr("x1", "50%")
          .attr("y1", "0%")
          .attr("x2", "50%")
          .attr("y2", "100%");

      gradient.append("stop")
          .attr("offset", "0%")
          .attr("stop-color", "#fff");

      gradient.append("stop")
          .attr("offset", "30%")
          .attr("stop-color", "#eee");

      gradient.append("stop")
          .attr("offset", "80%")
          .attr("stop-color", "rgba(200,200,200,0)");
          
      gradient.append("stop")
          .attr("offset", "100%")
          .attr("stop-color", "rgba(255,255,255,0)");

      // could use transparent gradient overlay to vary raindrop color
      svg.selectAll("path")
          .data(d3.range(360))
          .enter()
          .append("path")
          .transition()
          .delay(100)
          .duration(3000)
          .ease("bounce")
          .attr("fill", "url(#gradient)")
          .attr("d", function() { return raindrop(5 + Math.random() * 100); })
          .attr("transform", function(d) {
            return "rotate(" + d + ")" + "translate(" + (height / 6 + Math.random() * height / 16) + ",0)" + "rotate(90)";
          })
          .each("end",function() { // the first position
            d3.select(this)
              .transition()
              .duration(3000)
              .attr("d", function() { return raindrop(0); }); // a new transition!;
          });

      // build path of raindrop
      function raindrop(size) {
        var r = Math.sqrt(size / Math.PI).toFixed(2);
        return "M" + r + ",0"
            + "A" + 0.5*r + "," + 0.3*r + " 0 1,1 " + -r + ",0"
            + "C" + -r + "," + -r + " 0," + -2*r + " 0," + -12*r
            + "C," + -r + " " + r + "," + -r + " " + r + ",0"
            + "Z";
      };

      /* my-animation: Example 2. */
      var svg = d3.select("my-line-animation").append("svg")
                                 .attr("width", 600)
                                 .attr("height", 300);

      var lineData = [ { "x": 0, "y": 0},  { "x": 80, "y": 80},
                 { "x": 160, "y": 40},  { "x": 300, "y": 10}],
          endLineData = [ { "x": 0, "y": 0},  { "x": 150, "y": 120},
                 { "x": 170, "y": 50},  { "x": 300, "y": 20}];

      // set ranges of x axis and y axis
      var x = d3.scale
                .linear()
                .domain([0, d3.max(lineData, function(d){ return d.x; })])
                .range([0, width - 50]);
      var y = d3.scale
                .linear()
                .domain([d3.max(lineData, function(d){ return d.y; }), 0])
                .range([0, height - 50]);

      var xAxis = svg.append('g')
                    .attr('class', 'x axis')
                    .attr('transform', 'translate(50,' + ( height - 250 ) + ')')
                    .call(d3.svg.axis().scale(x).orient("bottom").ticks(10).tickSize(0, 10));

      var yAxis = svg.append('g')
                    .attr('class', 'y axis')
                    .attr('transform', 'translate(' + ( width - 450 ) + ',-200)')
                    .call(d3.svg.axis().scale(y).orient('left').ticks(10).tickSize(-450, 6, 0));

      svg.selectAll('.x text').attr('y', '20'); // adjust positions of axis text
      svg.select('.y line').attr('x2', '0'); // change length of the first line of y axes

      var lineFunction = d3.svg.line()
                               .x(function(d) { return d.x; })
                               .y(function(d) { return -d.y; })
                               .interpolate("cardinal");

      var defs = svg.append("defs");
      var gradient = defs.append("linearGradient")
         .attr("id", "svgGradient")
         .attr("x1", "0%")
         .attr("x2", "100%")
         .attr("y1", "0%")
         .attr("y2", "100%");
         
      gradient.append("stop")
         .attr('class', 'start')
         .attr("offset", "0%")
         .attr("stop-opacity", 0);

      gradient.append("stop")
         .attr('class', 'end')
         .attr("offset", "50%")
         .attr("stop-color", "#999")
         .attr("stop-opacity", .6);

      gradient.append("stop")
         .attr('class', 'end')
         .attr("offset", "50%")
         .attr("stop-color", "#999")
         .attr("stop-opacity", .6);
         
      gradient.append("stop")
         .attr('class', 'end')
         .attr("offset", "100%")
         .attr("stop-color", "#000")
         .attr("stop-opacity", 1);

      var line = svg.append("path")
                    .attr("d", lineFunction(lineData))
                    .attr("stroke-width", 2)
                    .attr("stroke", "url(#svgGradient)")
                    .attr("stroke-linecap", "round")
                    .attr("fill", "none")
                    .attr('transform', 'translate(50,250)')
                    .transition()
                    .duration(2000)
                    .ease("bounce")
                    .attrTween("stroke-dasharray", function() {
                        var len = this.getTotalLength();
                        return function(t) { return (d3.interpolateString("0," + len, len + ",0"))(t) };
                    })
                    .each("end",function() { // the first position
                      d3.select(this)
                        .transition()
                        .duration(3000)
                        .delay(500)
                        .attr("d", function() { return lineFunction(endLineData); }); // a new transition!;
                    });
    }]);
    // end of decoratorCtrl
  };
})(jQuery);
