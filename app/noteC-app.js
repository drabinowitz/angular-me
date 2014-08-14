angular.module('noteCApp',['ngRoute','ngAnimate','noteCAppViews']).

  config(['$locationProvider','$routeProvider', function($locationProvider,$routeProvider){
    
    $locationProvider.hashPrefix('!');

    $routeProvider.otherwise({

      redirectTo : '/home'

    });

  }]).

  controller('tabCtrl',['$scope',function($scope){

    $scope.tabs = [

      {name : 'Home',

      link : '#!/home'},

      {name : 'NoteDecks',

      link : '#!/noteDecks'},

    ];

  }]);