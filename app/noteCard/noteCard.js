directivesModule.directive('noteCard',['noteCDataStore',function(noteCDataStore) {

  return {

    restrict : 'E',

    templateUrl : 'noteCard/noteCard.html',

    scope : true,

    transclude : true,

    link : function(scope, element, attrs){

      scope.title = attrs.noteCardTitle;

      scope.deckName = attrs.noteCardDeck;

      scope.cardContent = attrs.noteCardContent;

      scope.deleteCard = function(deckName,cardTitle){

        noteCDataStore.deleteCard(deckName,cardTitle);

      }

      scope.showEditForm = function(){

        scope.showEdit = true;

        scope.editTitle = scope.title;

        scope.editContent = scope.cardContent;

      }

      scope.submit = function(editTitle,editContent){

        noteCDataStore.editCard(scope.deckName,scope.title,editTitle,editContent);

        scope.showEdit = false;

      }

    }

  }

}]);