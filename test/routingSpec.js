describe('noteC-app-views',function(){

	beforeEach( module('noteCAppViews') );

	describe('/home route', function(){

		it('loades the home.html content by default and on button click for Home',
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

	describe('/notes route', function(){

    beforeEach(inject(function($controller, $rootScope) {

    	noteCards = [

        {name : 'title1',

        content : 'text1'}

	    ];

      scope = $rootScope.$new();

      ctrl = $controller('notesCtrl', {

        $scope : scope,

        noteCards : noteCards

      });

    }));

		it('loads the countries.html, resolves a request for countries, and attaches the countries controller',
					inject(function($location,$rootScope,$httpBackend,$rootElement,$compile){

			var view = $compile('<div ng-view></div>')($rootScope);

			$rootElement.append(view);

			$httpBackend.expectGET('./notes/notes.html').respond('...');

			$rootScope.$apply(function() {
                $location.path('/notes');
            });

            $rootScope.$digest();

            expect( scope.noteCards[0].name ).toBe('title1')

		}));

	});

});