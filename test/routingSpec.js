describe('noteC-app-views',function(){

	beforeEach( module('noteCAppViews') );

	describe('/home route', function(){

		it('loades the home.html content on /home route',
		inject(function($location,$rootScope,$httpBackend,$rootElement,$compile){

			var view = $compile('<div ng-view></div>')($rootScope);

			$rootElement.append(view);

			$httpBackend.expect('GET','./home/home.html').respond('...');

			$rootScope.$apply(function() {
                
        $location.path('/home');
            
      });

      $rootScope.$digest();

		}));

	});

	describe('/noteDecks route', function(){

    beforeEach(inject(function($controller, $rootScope) {

    	noteCards = [

        {name : 'title1',

        content : 'text1'}

	    ];

      scope = $rootScope.$new();

      ctrl = $controller('noteDecksCtrl', {

        $scope : scope,

        noteCards : noteCards

      });

    }));

		it('gets the notecards data on route',
					inject(function($location,$rootScope,$httpBackend,$rootElement,$compile){

			var view = $compile('<div ng-view></div>')($rootScope);

			$rootElement.append(view);

			$httpBackend.expectGET('./noteDecks/noteDecks.html').respond('...');

			$rootScope.$apply(function() {
                
        $location.path('/noteDecks');
        
      });

      $rootScope.$digest();

      expect( scope.noteCards[0].name ).toBe('title1')

		}));

	});

});