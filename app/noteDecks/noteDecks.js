viewsModule.config(['$routeProvider',function($routeProvider){

  $routeProvider.when('/noteDecks',{

    templateUrl : './noteDecks/noteDecks.html',

    controller : 'noteDecksCtrl as ctrl'

  });

}]).

controller('noteDecksCtrl',['$scope','noteCDecks',function($scope,noteCDecks){

  $scope.showAddDeck = false;

  $scope.noteDecks = noteCDecks.get();

  this.addNoteDeck = function(){

    console.log('this');

  }

}]);