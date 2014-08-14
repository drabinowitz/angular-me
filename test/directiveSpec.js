describe('noteCard', function(){

	var scope,
		element,
		compiled,
		html,
		ctrl;

	beforeEach(module('noteCDirectives'));

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