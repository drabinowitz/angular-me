viewsModule.config(['$routeProvider',function($routeProvider){

  $routeProvider.when('/noteDecks/:noteDeck/noteCards',{

    templateUrl : './noteDecks/noteCards/noteCards.html',

    controller : 'noteCardsCtrl as ctrl'

  });

}]).

controller('noteCardsCtrl',['$scope','$route','noteCDataStore',function($scope,$route,noteCDataStore){

  var deckName = $route.current.params.noteDeck;

  $scope.addCardInvalid = false;

  $scope.noteCards = noteCDataStore.getCards(deckName);

  this.addNoteCard = function(title,content){

    if($scope.addCardForm.$valid){

      $scope.addCardInvalid = false;
    
      noteCDataStore.addCard(deckName,title,content);

    } else {

      $scope.addCardInvalid = true;

    }

  };

}]);