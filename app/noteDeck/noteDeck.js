directivesModule.directive('noteDeck',['noteCDataStore',function(noteCDataStore) {

  return {

    restrict : 'E',

    templateUrl : 'noteDeck/noteDeck.html',

    scope : true,

    transclude: true,

    link : function(scope, element, attrs){

      noteCDataStore.decks.get(attrs.deck).then(function(result){

        scope.deck = result;

      });

      // scope.deckDescription = attrs.noteDeckDescription;

      scope.showDelete = false;

      scope.deleteDeck = function(){

        noteCDataStore.decks.remove(scope.deck.title);

        scope.showDelete = false;

      };

      scope.showEditForm = function(){

        scope.showEdit = true;

        scope.editTitle = scope.deck.title;

        scope.editDescription = scope.deck.description;

      };

      scope.submit = function(editTitle,editDescription){

        noteCDataStore.decks.edit(scope.deck.title,editTitle,editDescription);

        scope.showEdit = false;

      };

    }

  }

}]);