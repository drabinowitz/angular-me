angular.module('noteCApp',['ngRoute','ngAnimate','noteCAppViews']).

  config(['$locationProvider','$routeProvider', function($locationProvider,$routeProvider){
    
    $locationProvider.hashPrefix('!');

    $routeProvider.otherwise({

      redirectTo : '/home'

    });

  }]);