angular.module('noteCApp',['ui.router','ngAnimate','noteCAppViews']).

  config(['$stateProvider','$urlRouterProvider', function($stateProvider,$urlRouterProvider){

    $urlRouterProvider.otherwise('/home');

    $stateProvider.

    state('home',{

      url : '/home',
      templateUrl : 'home/home.html'

    }).

    state('noteDecks',{

      url : '/noteDecks/:noteDeck',
      templateUrl : 'noteDecks/noteDecks.html',

    }).

    state('noteDecks.noteCards',{

      url : '/noteCards',
      templateUrl : 'noteDecks/noteCards/noteCards.html'

    });
    
  }]).

  controller('tabCtrl',['$scope','$location',function($scope,$location){

    $scope.tabs = [

      {name : 'Home',

      state : 'home'},

      {name : 'NoteDecks',

      state : 'noteDecks'},

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