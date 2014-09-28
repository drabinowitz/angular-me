viewsModule.

controller('noteDecksCtrl',['$scope','noteCDataStore',function($scope,noteCDataStore){

  $scope.showAddDeck = false;

  $scope.addDeckInvalid = false;

  var promise = noteCDataStore.decks.get().then(function(result){

    $scope.noteDecks = result;

  });

  this.addNoteDeck = function(title,description){

    if($scope.addDeckForm.$valid){

      noteCDataStore.decks.add(title,description);
    
      $scope.addDeckInvalid = false;

      $scope.showAddDeck = false;

    } else {

      $scope.addDeckInvalid = true;

    }

  };

}]);