angular.module('noteCApp',['ngRoute','ngAnimate','noteCAppViews']).

  config(['$locationProvider','$routeProvider', function($locationProvider,$routeProvider){
    
    $locationProvider.hashPrefix('!');

    $routeProvider.otherwise({

      redirectTo : '/home'

    });

  }]).

  controller('tabCtrl',['$scope','$location',function($scope,$location){

    $scope.tabs = [

      {name : 'Home',

      link : '#!/home'},

      {name : 'NoteDecks',

      link : '#!/noteDecks'},

    ];

    $scope.isCurrentTab = function(tab){

      return $location.$$path.match(/[A-Za-z]+/)[0].toLowerCase() == tab.toLowerCase();

    }

  }]);