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

				cards : { 

					get : function(deckName,cardTitle){

						return {

							then : function(callback){

								callback({ 

									title : 'test-card',

									content : 'test-content'

								});

							}

						};

					}

				},

				decks : {

					get : function(deckName){

						return {

							then : function(callback){

								callback({ 

									title : 'test-deck',

									description : 'test-description'

								});

							}

						};

					}

				}

			});

		});

	});

	describe('noteCard',function(){

		beforeEach(module('noteCard/noteCard.html'));

		beforeEach(inject(function($rootScope, $compile){

			html="";

			html += "<note-card deck='test-deck' card='test-card'></note-card>";

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

			html += "<note-deck deck='test-deck'>test-description</note-deck>";

			scope = $rootScope.$new();

			compiled = $compile(html);

			element = compiled(scope);

			scope.$digest();

		}));

		it('should correctly attach the directive controller', function() {

			expect( element.find('div').text() ).toContain('test-deck');

			expect( element.find('div').text() ).toContain('test-description');

		});

	});

});