directivesModule.directive('noteCard',['noteCDataStore',function(noteCDataStore) {

  return {

    restrict : 'E',

    templateUrl : 'noteCard/noteCard.html',

    scope : true,

    transclude : true,

    link : function(scope, element, attrs){

      scope.title = attrs.noteCardTitle;

      scope.deckName = attrs.noteCardDeck;

      noteCDataStore.getCard(scope.deckName,scope.title).then(function(card){

        scope.card = card;

      });

      scope.deleteCard = function(deckName,cardTitle){

        noteCDataStore.deleteCard(deckName,cardTitle);

      }

      scope.showEditForm = function(){

        scope.showEdit = true;

        scope.editTitle = scope.title;

        scope.editContent = scope.card.content;

      }

      scope.submit = function(editTitle,editContent){

        noteCDataStore.editCard(scope.deckName,scope.title,editTitle,editContent);

        scope.showEdit = false;

      }

      scope.hideEdit = function(){

        scope.showEdit = false;

      }

    }

  }

}]);