directivesModule.directive('noteCard',['noteCDataStore',function(noteCDataStore) {

  return {

    restrict : 'E',

    templateUrl : 'noteCard/noteCard.html',

    scope : true,

    transclude : true,

    link : function(scope, element, attrs){

      scope.isSelectable = attrs.isSelectable;

      scope.selected = false;

      noteCDataStore.cards.get(attrs.deck,attrs.card).then(function(card){

        scope.card = card;

      });

      scope.deleteCard = function(){

        scope.selected = false;

        noteCDataStore.cards.remove(attrs.deck,scope.card.title);

      };

      scope.showEditForm = function(){

        scope.showEdit = true;

        scope.editTitle = scope.card.title;

        scope.editContent = scope.card.content;

      };

      scope.submit = function(editTitle,editContent){

        noteCDataStore.cards.edit(attrs.deck,scope.card.title,editTitle,editContent);

        scope.showEdit = false;

      };

      scope.$watch('selected',function(newVal){

        scope.$emit('selection change',attrs.card,newVal);

      });

/*      scope.hideEdit = function(){

        scope.showEdit = false;

      }*/

    }

  }

}]);