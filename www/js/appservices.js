(function() {
    'use strict';
    angular
        .module('starter.services', [])
        .service('AppService', AppService)
        .directive('ngMin', function() {
            return {
                restrict: 'A',
                require: 'ngModel',
                link: function(scope, elem, attr, ctrl) {
                    scope.$watch(attr.ngMin, function() {
                        if (ctrl.$isDirty) ctrl.$setViewValue(ctrl.$viewValue);
                    });

                    var isEmpty = function(value) {
                        return angular.isUndefined(value) || value === "" || value === null;
                    }

                    var minValidator = function(value) {
                        var min = scope.$eval(attr.ngMin) || 0;
                        if (!isEmpty(value) && value < min) {
                            ctrl.$setValidity('ngMin', false);
                            return undefined;
                        } else {
                            ctrl.$setValidity('ngMin', true);
                            return value;
                        }
                    };

                    ctrl.$parsers.push(minValidator);
                    ctrl.$formatters.push(minValidator);
                }
            };
        })

    .directive('ngMax', function() {
            return {
                restrict: 'A',
                require: 'ngModel',
                link: function(scope, elem, attr, ctrl) {
                    scope.$watch(attr.ngMax, function() {
                        if (ctrl.$isDirty) ctrl.$setViewValue(ctrl.$viewValue);
                    });
                    var maxValidator = function(value) {
                        var max = scope.$eval(attr.ngMax) || Infinity;
                        if (!isEmpty(value) && value > max) {
                            ctrl.$setValidity('ngMax', false);
                            return undefined;
                        } else {
                            ctrl.$setValidity('ngMax', true);
                            return value;
                        }
                    };

                    ctrl.$parsers.push(maxValidator);
                    ctrl.$formatters.push(maxValidator);
                }
            };
        })
        .directive('groupedRadio', function() {
            return {
                restrict: 'A',
                require: 'ngModel',
                scope: {
                    model: '=ngModel',
                    value: '=groupedRadio'
                },
                link: function(scope, element, attrs, ngModelCtrl) {
                    element.addClass('button');
                    element.on('click', function(e) {
                        scope.$apply(function() {
                            ngModelCtrl.$setViewValue(scope.value);
                        });
                    });

                    scope.$watch('model', function(newVal) {
                        element.removeClass('button-positive');
                        if (newVal === scope.value) {
                            element.addClass('button-positive');
                        }
                    });
                }
            };
        })

    .directive('ionToggleText', function() {

        var $ = angular.element;

        return {
            restrict: 'A',
            link: function($scope, $element, $attrs) {

                // Try to figure out what text values we're going to use 

                var textOn = $attrs.ngTrueValue || 'on',
                    textOff = $attrs.ngFalseValue || 'off';

                if ($attrs.ionToggleText) {
                    var x = $attrs.ionToggleText.split(';');

                    if (x.length === 2) {
                        textOn = x[0] || textOn;
                        textOff = x[1] || textOff;
                    }
                }

                // Create the text elements

                var $handleTrue = $('<div class="handle-text handle-text-true">' + textOn + '</div>'),
                    $handleFalse = $('<div class="handle-text handle-text-false">' + textOff + '</div>');

                var label = $element.find('label');

                if (label.length) {
                    label.addClass('toggle-text');

                    // Locate both the track and handle elements

                    var $divs = label.find('div'),
                        $track, $handle;

                    angular.forEach($divs, function(div) {
                        var $div = $(div);

                        if ($div.hasClass('handle')) {
                            $handle = $div;
                        } else if ($div.hasClass('track')) {
                            $track = $div;
                        }
                    });

                    if ($handle && $track) {

                        // Append the text elements

                        $handle.append($handleTrue);
                        $handle.append($handleFalse);

                        // Grab the width of the elements

                        var wTrue = $handleTrue[0].offsetWidth,
                            wFalse = $handleFalse[0].offsetWidth;

                        // Adjust the offset of the left element

                        $handleTrue.css('left', '-' + (wTrue + 10) + 'px');

                        // Ensure that the track element fits the largest text

                        var wTrack = Math.max(wTrue, wFalse);
                        $track.css('width', (wTrack + 60) + 'px');
                    }
                }
            }
        };

    });


    function AppService($q, $http) {
        console.log("pppp AppService");
        return {
            getDataFromUrl: function(myUrl, dataObj) {
                var deferred = $q.defer();
                var promise = deferred.promise;

                var req = {
                    method: 'get',
                    url: myUrl
                }
                $http(req).then(function(response) {
                    if (response.data) {
                        deferred.resolve(response.data);
                    } else {
                        deferred.reject('Something went wrong in getting details.');
                    }
                }, function(response) {
                    deferred.reject('Something went wrong server call. response : ', response);
                });
                promise.success = function(fn) {
                    promise.then(fn);
                    return promise;
                }
                promise.error = function(fn) {
                    promise.then(null, fn);
                    return promise;
                }
                return promise;
            }
        }
    }

})();
