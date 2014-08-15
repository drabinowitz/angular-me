viewsModule.config(['$routeProvider',function($routeProvider){

  $routeProvider.when('/noteDecks/:noteDeck/noteCards',{

    templateUrl : './noteDecks/noteCards/noteCards.html',

    controller : 'noteCardsCtrl as ctrl'

  });

}]).

controller('noteCardsCtrl',['$scope','$route','noteCDecks',function($scope,$route,noteCDecks){

  var index = $route.current.params.noteDeck;

  $scope.addCardInvalid = false;

  $scope.noteCards = noteCDecks.get(index);

  this.addNoteCard = function(title,content){

    if($scope.addCardForm.$valid){

      $scope.addCardInvalid = false;
    
      noteCDecks.addCard(index,title,content);

    } else {

      $scope.addCardInvalid = true;

    }

  };

}]);