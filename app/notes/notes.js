viewsModule.config(['$routeProvider',function($routeProvider){

  $routeProvider.when('/notes',{

    templateUrl : './notes/notes.html',

    controller : 'notesCtrl',

    resolve : {

      noteCards : ['noteCInfo',function(noteCInfo){

        return noteCInfo.get();

      }]

    }

  });

}]).

controller('notesCtrl',['$scope','noteCards',function($scope,noteCards){

  $scope.noteCards = noteCards;

}]);