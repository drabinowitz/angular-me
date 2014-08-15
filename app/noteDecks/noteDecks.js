viewsModule.config(['$routeProvider',function($routeProvider){

  $routeProvider.when('/noteDecks',{

    templateUrl : './noteDecks/noteDecks.html',

    controller : 'noteDecksCtrl as ctrl'

  });

}]).

controller('noteDecksCtrl',['$scope','noteCDecks',function($scope,noteCDecks){

  $scope.showAddDeck = false;

  $scope.addDeckInvalid = false;

  $scope.noteDecks = noteCDecks.get();

  this.addNoteDeck = function(title,description){

    if($scope.addDeckForm.$valid){

      noteCDecks.addDeck(title,description);
    
      $scope.addDeckInvalid = false;

      $scope.showAddDeck = false;

    } else {

      $scope.addDeckInvalid = true;

    }

  };

  this.getArrayIndex = function(id){

    return noteCDecks.getIndex(id);

  };

}]);