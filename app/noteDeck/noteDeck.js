directivesModule.directive('noteDeck',['noteCDataStore',function(noteCDataStore) {

  return {

    restrict : 'E',

    templateUrl : 'noteDeck/noteDeck.html',

    scope : true,

    transclude: true,

    link : function(scope, element, attrs){

      scope.title = attrs.noteDeckTitle;

      noteCDataStore.getDecks( attrs.noteDeckTitle ).then(function(deck){

        scope.deck = deck;

      });

      // scope.deckDescription = attrs.noteDeckDescription;

      scope.showDelete = false;

      scope.deleteDeck = function(title){

        noteCDataStore.deleteDeck(title);

        scope.showDelete = false;

      };

      scope.showEditForm = function(){

        scope.showEdit = true;

        scope.editTitle = scope.title;

        scope.editDescription = scope.deckDescription;

      };

      scope.submit = function(editTitle,editDescription){

        noteCDataStore.editDeck(scope.title,editTitle,editDescription);

        scope.showEdit = false;

      };

    }

  }

}]);