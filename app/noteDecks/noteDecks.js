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

      $scope.addDeckInvalid = false;
    
      noteCDecks.add(title,description);

    } else {

      $scope.addDeckInvalid = true;

    }

  };

  this.getArrayIndex = function(id){

    return noteCDecks.getIndex(id);

  };

}]);