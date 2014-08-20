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

      scope.editCard = function(deckName,oldCardTitle,newCardTitle,newCardContent){

        noteCDataStore.editCard(deckName,oldCardTitle,newCardTitle,newCardContent);

        scope.showEdit = false;

      }

      scope.submit = function(editTitle,editContent){

        if(scope.editForm.$valid){

          scope.editCard(scope.deckName,scope.title,editTitle,editContent);

        } else {

          console.log('form not valid')

        }

        scope.showEdit = false;

      }

    }

  }

}]);