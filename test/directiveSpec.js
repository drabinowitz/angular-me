describe('noteCDirectives', function(){

	var scope,
		element,
		compiled,
		html,
		ctrl;

	beforeEach(module('noteCApp'));

	beforeEach(function(){

		module(function($provide) {

			$provide.value('noteCDataStore',{

				getCards : function(deckName,cardTitle){

					return {

						then : function(callback){

							callback({ content : 'test-content' });

						}

					};

				},

				getDecks : function(deckName){

					return {

						then : function(callback){

							callback({ description : 'test-description' });

						}

					};

				}

			});

		});

	});

	describe('noteCard',function(){

		beforeEach(module('noteCard/noteCard.html'));

		beforeEach(inject(function($rootScope, $compile){

			html="";

			html += "<note-card note-card-deck='test-deck' note-card-title='test-card'></note-card>";

			scope = $rootScope.$new();

			compiled = $compile(html);

			element = compiled(scope);

			scope.$digest();

		}));

		it('should correctly attach the directive controller', function() {

			expect( element.find('div').text() ).toContain('test-card');

			expect( element.find('div').text() ).toContain('test-content');

		});

	});

	describe('noteDeck',function(){

		beforeEach(module('noteDeck/noteDeck.html'));

		beforeEach(inject(function($rootScope, $compile){

			html="";

			html += "<note-deck note-deck-title='test-title' note-deck-description='test-description'>test-description</note-deck>";

			scope = $rootScope.$new();

			compiled = $compile(html);

			element = compiled(scope);

			scope.$digest();

		}));

		it('should correctly attach the directive controller', function() {

			expect( element.find('div').text() ).toContain('test-title');

			expect( element.find('div').text() ).toContain('test-description');

		});

	});

});