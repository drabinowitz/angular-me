directivesModule.directive('noteDeck',function() {

  return {

    restrict : 'E',

    templateUrl : 'noteDeck/noteDeck.html',

    scope : true,

    transclude: true,

    link : function(scope, element, attrs){

      scope.title = attrs.noteDeckTitle;

    }

  }

});