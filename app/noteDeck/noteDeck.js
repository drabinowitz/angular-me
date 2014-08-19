directivesModule.directive('noteDeck',['noteCDataStore',function(noteCDataStore) {

  return {

    restrict : 'E',

    templateUrl : 'noteDeck/noteDeck.html',

    scope : true,

    transclude: true,

    link : function(scope, element, attrs){

      scope.title = attrs.noteDeckTitle;

      scope.showDelete = false;

      scope.deleteDeck = function(title){

        noteCDataStore.deleteDeck(title);

        scope.showDelete = false;

      };

    }

  }

}]);