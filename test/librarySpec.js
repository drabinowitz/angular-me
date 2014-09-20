describe('noteCLibrary',function(){

	beforeEach( module('noteCApp') );

	xdescribe('noteCFirebaseRequest',function(){

		it('requests data from firebase',	
		inject(function(noteCFirebaseRequest,NOTEC_FIREBASE_DECKS){

			var decks = noteCFirebaseRequest.get(NOTEC_FIREBASE_DECKS);

			expect(decks.$id).toBe('decks');

		}));

	});

	describe('noteCPromiseGenerator',function(){

		it('creates generates deferred promises',inject(function(noteCPromiseGenerator){

			var instantResolve = noteCPromiseGenerator.instant('data');

			expect(instantResolve.then).toBeDefined();

			var standardResolve = noteCPromiseGenerator.standard(function(){

				return instantResolve;

			});

			expect(standardResolve.then).toBeDefined();

			var objectToResolve = { promise : function(){

				return instantResolve;

			}};

			var objectResolve = noteCPromiseGenerator.objectStandard(objectToResolve,'promise');

			expect(objectResolve.then).toBeDefined();

		}));

	});

	describe('noteCDataStore',function(){

		beforeEach(function(){

			module(function($provide) {

	      $provide.value('noteCPromiseGenerator',{

	      	standard : function(ajaxRequest,filter) {

	      		if(filter == undefined){

		      		return ajaxRequest();

		      	} else {

		      		return filter( ajaxRequest() );

		      	}
	      	
	      	},

	      	objectStandard : function(requester,ajaxRequest,filter){

	      		if(filter == undefined){

		      		return requester;

		      	} else {

		      		return filter( requester );

		      	}

	      	},

	      	instant : function(data,filter){

	      		return data;

	      	}

	      });

	      $provide.value('noteCFirebaseRequest',{

	      	fireBaseStruct : {

	      		decks : {

	      			AADECK : {

	      				title : 'test-deck',

	      				description : 'test-description',

	      				noteCards : {

	      					AANOTE : {

	      						title : 'test-card',

	      						content : 'test-content'

	      					}

	      				},

	      				map : {

	      					'test-card' : 'AANOTE'

	      				}

	      			}

	      		},

	      		map : {

	      			'test-deck' : 'AADECK'

	      		}

	      	},

	      	asArray : function(path){

	      		var arrayToReturn = function(location,record){

	      			var result = [location];

	      			result[record] = 0;

	      			result.$getRecord = function(key){

	      				return result [ result [ key ] ];

	      			};

	      			result.$add = function(obj){

	      				this.push(obj);

	      				this.BB = 1;

	      				return {

	      					then : function (callback){

	      						var ref = {

	      							name : function(){

	      								return BB;

	      							}

	      						};

	      						callback(ref);

	      					}

	      				}

	      			};

	      			result.$remove = function(obj){

	      				var arr = this;

	      				for (var i = 0; i < arr.length; i++){

	      					if (arr[i] == obj){

	      						
	      						
	      					}

	      				}

	      			};

	      			return result;

	      		};

	      		if (path.match(/test-deck/)){

	      			return arrayToReturn( this.fireBaseStruct.decks.AADECK.noteCards.AANOTE,'AANOTE' );

	      		} else if(path.match(/decks/)){

							return arrayToReturn( this.fireBaseStruct.decks.AADECK,'AADECK' );	      			

	      		}

	      	},

	      	asObject : function(path){

	      		var objectToReturn = function(obj){

	      			var result;

	      			for (var item in obj){

	      				if (obj.hasOwnProperty(item)){

	      					result[item] = obj[item];

	      				}

	      			}

	      			result.$save = function(input){

	      				return { 

	      					then : function(callback){

	      						callback(input);

	      					}

	      				};

	      			};

	      		};

	      		if (path.match(/test-deck/)){

	      			return objectToReturn( this.fireBaseStruct.decks.AADECK.map );

	      		} else if(path.match(/decks/)){

							return objectToReturn( this.fireBaseStruct.map );	      			

	      		}	      		

	      	}

	      })

	    });

		});

		it('gets the decks and stores them',
		inject(function(noteCDataStore){

			var decks = noteCDataStore.decks.get();

			expect( decks['test-deck'].description ).toBe('test-deck');

		}));

		it('gets the cards and stores them',
		inject(function(noteCDataStore){

			var cards = {};

			cards['test-deck'] = noteCDataStore.cards.get('test-deck');

			expect( cards['test-deck']['test-card'].content ).toBe('a test-card');

		}));

		it('enables getting an individual card',
		inject(function(noteCDataStore){

			var cards = {};

			cards['test-deck'] = noteCDataStore.cards.get('test-deck');

			var card = noteCDataStore.cards.get('test-deck','test-card');

			expect( card.content )

		}));

		it('enables adding decks',
		inject(function(noteCDataStore){

			var decks = noteCDataStore.decks.get();

			noteCDataStore.decks.add('add-deck','add-description');

			expect( decks['add-deck'].description ).toBe('add-description');

		}));

		it('enables adding cards',
		inject(function(noteCDataStore){

			var cards = {};

			cards['test-deck'] = noteCDataStore.cards.get('test-deck');

			noteCDataStore.cards.add('test-deck','add-card','added-card')

			expect( cards['test-deck']['add-card'].content ).toBe('added-card');

		}));

		it('enables deleting decks',
		inject(function(noteCDataStore){

			var decks = noteCDataStore.decks.get();

			noteCDataStore.decks.remove('test-deck');

			expect( decks['test-deck'] ).not.toBeDefined();

		}));

		it('enables deleting cards',
		inject(function(noteCDataStore){

			var cards = {};

			cards['test-deck'] = noteCDataStore.cards.get('test-deck');

			noteCDataStore.cards.remove('test-deck','test-card');

			expect( cards['test-deck']['test-card'] ).not.toBeDefined();

		}));

		it('enables editing decks',
		inject(function(noteCDataStore){

			var decks = noteCDataStore.decks.get();

			noteCDataStore.decks.edit('test-deck','edit-deck','edit-description');

			expect( decks['test-deck'] ).not.toBeDefined();

			expect( decks['edit-deck'].description ).toBe('edit-description');

		}));

		it('enables editing cards',
		inject(function(noteCDataStore){

			var cards = {};

			cards['test-deck'] = noteCDataStore.cards.get('test-deck');

			noteCDataStore.cards.edit('test-deck','test-card','edit-card','edit-content');

			expect( cards['test-deck']['test-card'] ).not.toBeDefined();

			expect( cards['test-deck']['edit-card'].content ).toBe('edit-content');

		}));

	});

});