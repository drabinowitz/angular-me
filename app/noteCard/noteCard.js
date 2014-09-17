directivesModule.directive('noteCard',['noteCDataStore',function(noteCDataStore) {

  return {

    restrict : 'E',

    templateUrl : 'noteCard/noteCard.html',

    scope : true,

    transclude : true,

    link : function(scope, element, attrs){

      noteCDataStore.cards.get(attrs.deck,attrs.card).then(function(card){

        scope.card = card;

      });

      scope.deleteCard = function(deckName,cardTitle){

        noteCDataStore.cards.remove(deckName,cardTitle);

      };

      scope.showEditForm = function(){

        scope.showEdit = true;

        scope.editTitle = scope.title;

        scope.editContent = scope.card.content;

      };

      scope.submit = function(editTitle,editContent){

        noteCDataStore.cards.edit(scope.deckName,scope.title,editTitle,editContent);

        scope.showEdit = false;

      };

/*      scope.hideEdit = function(){

        scope.showEdit = false;

      }*/

    }

  }

}]);