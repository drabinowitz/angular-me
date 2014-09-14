viewsModule.config(['$routeProvider',function($routeProvider){

  $routeProvider.when('/noteDecks/:noteDeck/noteCards',{

    templateUrl : './noteDecks/noteCards/noteCards.html',

    controller : 'noteCardsCtrl as ctrl'

  });

}]).

controller('noteCardsCtrl',['$scope','$route','noteCDataStore',function($scope,$route,noteCDataStore){

  $scope.deckName = $route.current.params.noteDeck;

  $scope.addCardInvalid = false;

  noteCDataStore.cards.get($scope.deckName).then(function(result){

    $scope.noteCards = result;

  });

  this.addNoteCard = function(title,content){

    if($scope.addCardForm.$valid){

      $scope.addCardInvalid = false;
    
      noteCDataStore.cards.add($scope.deckName,title,content);

    } else {

      $scope.addCardInvalid = true;

    }

  };

}]);