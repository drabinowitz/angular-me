describe('noteCDirectives', function(){

	var scope,
		element,
		compiled,
		html,
		ctrl;

	beforeEach(module('noteCApp'));

	ddescribe('noteCard',function(){

		beforeEach(function(){

			module(function($provide) {

				$provide.value('noteCDataStore',{

					getCard : function(deckName,cardTitle){

						return { content : 'test-content' };

					}

				});

			});

		});

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

			html += "<note-deck note-deck-title='title1'></note-deck>";

			scope = $rootScope.$new();

			compiled = $compile(html);

			element = compiled(scope);

			scope.$digest();

		}));

		it('should correctly attach the directive controller', function() {

			expect( element.find('h3').text() ).toContain('title1');

		});

	});

});