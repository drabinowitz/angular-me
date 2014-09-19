viewsModule.config(['$routeProvider',function($routeProvider){

  $routeProvider.when('/noteDecks/:noteDeck/noteCards',{

    templateUrl : './noteDecks/noteCards/noteCards.html',

    controller : 'noteCardsCtrl as ctrl'

  });

}]).

controller('noteCardsCtrl',['$rootScope','$scope','$route','noteCDataStore',function($rootScope,$scope,$route,noteCDataStore){

  var ctrl = this;

  $scope.deckName = $route.current.params.noteDeck;

  $scope.addCardInvalid = false;

  $scope.selected = {};

  $scope.showMassDelete = false;

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

  this.showMassDeleteForm = function(willShow){

    $scope.showMassDelete = willShow;

    $rootScope.$broadcast('showOverlay',willShow);

  };

  this.submitMassDeleteForm = function(){

    var cardsToDelete = [];

    for (var card in $scope.selected){

      if ($scope.selected[card]){

        cardsToDelete.push(card)

      }

    }

    if (cardsToDelete.length){

      cardsToDelete.unshift($scope.deckName);

      noteCDataStore.cards.remove.apply(undefined,cardsToDelete);

    }

    ctrl.showMassDeleteForm(false);

  };

}]);