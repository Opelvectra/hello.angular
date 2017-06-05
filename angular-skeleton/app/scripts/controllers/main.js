'use strict';

/**
 * @ngdoc function
 * @name helloangularApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the helloangularApp
 */
angular.module('helloangularApp')
  .controller('MainCtrl', function () {
	  console.log(0);
    this.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
  });
