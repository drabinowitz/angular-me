describe('noteCDirectives', function(){

	var scope,
		element,
		compiled,
		html,
		ctrl;

	beforeEach(module('noteCDirectives'));

	describe('noteCard',function(){

		beforeEach(module('noteCard/noteCard.html'));

		beforeEach(inject(function($rootScope, $compile){

			html="";

			html += "<note-card note-card-title='title1'></note-card>";

			scope = $rootScope.$new();

			compiled = $compile(html);

			element = compiled(scope);

			scope.$digest();

		}));

		it('should correctly attach the directive controller', function() {

			expect( element.find('div').text() ).toContain('title1');

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