directivesModule.directive('noteCard',['noteCDataStore',function(noteCDataStore) {

  return {

    restrict : 'E',

    templateUrl : 'noteCard/noteCard.html',

    scope : true,

    transclude : true,

    link : function(scope, element, attrs){

      scope.title = attrs.noteCardTitle;

      scope.deckName = attrs.noteCardDeck;

      scope.deleteCard = function(deckName,cardTitle){

        noteCDataStore.deleteCard(deckName,cardTitle);

      }

    }

  }

}]);