var countTo = angular.module('countTo', [])
    .directive('countTo', ['$timeout', function ($timeout) {
        return {
            replace: false,
            scope: true,
            link: function (scope, element, attrs) {

                var num, refreshInterval, duration, steps, step, countTo, value, increment;

                var calculate = function () {
                    refreshInterval = 30;
                    step = 0;
                    scope.timoutId = null;
                    countTo = parseInt(attrs.countTo) || 0;
                    scope.value = parseInt(attrs.value, 10) || 0;
                    duration = (parseFloat(attrs.duration) * 1000) || 0;

                    steps = Math.ceil(duration / refreshInterval);
                    increment = ((countTo - scope.value) / steps);
                    num = scope.value;
                };

                var commaSeparateNumber = function(val){
                    while (/(\d+)(\d{3})/.test(val.toString())){
                        val = val.toString().replace(/(\d+)(\d{3})/, '$1'+','+'$2');
                    }
                    return val;
                };

                var tick = function () {
                    scope.timoutId = $timeout(function () {
                        num += increment;
                        step++;
                        if (step >= steps) {
                            $timeout.cancel(scope.timoutId);
                            num = countTo;
                            element.text(commaSeparateNumber(countTo));
                        } else {
                            element.text(commaSeparateNumber(Math.round(num)));
                            tick();
                        }
                    }, refreshInterval);

                };

                var start = function () {
                    console.log('start');
                    if (scope.timoutId) {
                        console.log('cancel');
                        $timeout.cancel(scope.timoutId);
                    }
                    calculate();
                    tick();
                };

                attrs.$observe('countTo', function (val) {
                    if (val) {
                        start();
                    }
                });

                attrs.$observe('value', function (val) {
                    start();
                });

                return true;
            }
        }

    }]);
