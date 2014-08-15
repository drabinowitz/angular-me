viewsModule.config(['$routeProvider',function($routeProvider){

  $routeProvider.when('/noteDecks',{

    templateUrl : './noteDecks/noteDecks.html',

    controller : 'noteDecksCtrl as ctrl'

  });

}]).

controller('noteDecksCtrl',['$scope','noteCDataStore',function($scope,noteCDataStore){

  $scope.showAddDeck = false;

  $scope.addDeckInvalid = false;

  $scope.noteDecks = noteCDataStore.getDecks();

  this.addNoteDeck = function(title,description){

    if($scope.addDeckForm.$valid){

      noteCDataStore.addDeck(title,description);
    
      $scope.addDeckInvalid = false;

      $scope.showAddDeck = false;

    } else {

      $scope.addDeckInvalid = true;

    }

  };

  this.getArrayIndex = function(id){

    return noteCDataStore.getIndex(id);

  };

}]);