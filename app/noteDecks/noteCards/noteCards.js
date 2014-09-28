viewsModule.

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

  $scope.$on('selection change',function(event,card,isSelected){

    $scope.selected[card] = isSelected;

  });

  this.areSelected = function(){

    for (var item in $scope.selected){

      if ($scope.selected.hasOwnProperty(item) && $scope.selected[item]){

        return true;

      }

    }

    return false;

  }

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

    $scope.selected = {};

    ctrl.showMassDeleteForm(false);

  };

}]);