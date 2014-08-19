describe('noteC-app-views',function(){

	beforeEach( module('noteCApp') );

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

    	noteCDataStore = {

        getDecks : function(){

          return {

            'title1' : 'text1'

          };

  	    }

      };

      scope = $rootScope.$new();

      ctrl = $controller('noteDecksCtrl', {

        $scope : scope,

        noteCDataStore : noteCDataStore

      });

    }));

		it('should get the noteDecks data',
					inject(function($location,$rootScope,$httpBackend,$rootElement,$compile){

			var view = $compile('<div ng-view></div>')($rootScope);

			$rootElement.append(view);

			$httpBackend.expectGET('./noteDecks/noteDecks.html').respond('...');

			$rootScope.$apply(function() {
                
        $location.path('/noteDecks');
        
      });

      $rootScope.$digest();

      expect( scope.noteDecks['title1'] ).toBe('text1')

		}));

	});

describe('/noteCards route', function(){

    beforeEach(inject(function($controller, $rootScope) {

      noteCDataStore = {

        getCards : function(deckName){

          return {

            'title1' : 'text1'

          };

        }

      };

      scope = $rootScope.$new();

      ctrl = $controller('noteCardsCtrl', {

        $scope : scope,

        noteCDataStore : noteCDataStore,

        $route : { current : { params : {noteDeck : 'deck'} } }

      });

    }));

    it('gets the notecards data on route',
          inject(function($location,$rootScope,$httpBackend,$rootElement,$compile){

      var view = $compile('<div ng-view></div>')($rootScope);

      $rootElement.append(view);

      $httpBackend.expectGET('./noteDecks/noteCards/noteCards.html').respond('...');

      $rootScope.$apply(function() {
                
        $location.path('/noteDecks/deck/noteCards');
        
      });

      $rootScope.$digest();

      expect( scope.noteCards['title1'] ).toBe('text1')

    }));

  });

});