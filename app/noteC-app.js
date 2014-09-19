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

      var currentTab = $location.$$path.match(/[A-Za-z]+/);

      if (currentTab){

        return currentTab[0].toLowerCase() == tab.toLowerCase();
        
      } else {

        return false;

      }

    };

    $scope.$on('showOverlay',function(event,willShow){

      $scope.showOverlay = willShow;

    });

  }]);