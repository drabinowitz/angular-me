describe('noteCLibrary',function(){

	beforeEach( module('noteCApp') );

	describe('noteCFirebaseRequest',function(){

		it('requests data from firebase',	
		inject(function(noteCFirebaseRequest,NOTEC_FIREBASE_DECKS){

			var decks = noteCFirebaseRequest.get(NOTEC_FIREBASE_DECKS);

			expect(decks.$id).toBe('decks');

		}));

	});

	describe('noteCDataStore',function(){

		it('gets the decks and stores them',
		inject(function(noteCDataStore){

				var decks = noteCDataStore.getDecks();

				expect( decks.$id ).toBe('decks');

		}));

	});

});