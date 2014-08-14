viewsModule.config(['$routeProvider',function($routeProvider){

  $routeProvider.when('/noteDecks/:noteDeck/noteCards',{

    templateUrl : './noteDecks/noteCards/noteCards.html',

    controller : 'noteCardsCtrl as ctrl'

  });

}]).

controller('noteCardsCtrl',['$scope','$route','noteCNoteCards',function($scope,$route,noteCNoteCards){

  $scope.noteCards = noteCNoteCards.get( $route.current.params.noteDeck );

  this.addNoteCard = function(){

    console.log('this');

  }

}]);