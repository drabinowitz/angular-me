ddescribe('noteCLibrary',function(){

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

	      		var result = {};

	      		filter = filter || function (input){return input};

	      		result.then = function(callback){

							var ajaxResult;

							ajaxRequest().then(function(res){

								ajaxResult = res;

							});

							callback( filter( ajaxResult ) );

						};
	      	
		      	return result;
	      	
	      	},

	      	objectStandard : function(requester,ajaxRequest,filter){

	      		var result = {};

	      		if(filter == undefined){

		      		result.then = function(callback){

		      			return callback(requester);

		      		};

		      	} else {

		      		result.then = function(callback) {

		      			return callback( filter( requester ) );

		      		};

		      	}

		      	return result;

	      	},

	      	instant : function(data,filter){

	      		return data;

	      	}

	      });

	      $provide.value('noteCFirebaseRequest',{

	      	fireBaseStruct : {

	      		decks : {

	      			AA : {

	      				title : 'test-deck',

	      				description : 'test-description',

	      				noteCards : {

	      					AA : {

	      						title : 'test-card',

	      						content : 'test-content'

	      					}

	      				},

	      				map : {

	      					'test-card' : 'AA'

	      				}

	      			}

	      		},

	      		map : {

	      			'test-deck' : 'AA'

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

	      						return callback(ref);

	      					}

	      				};

	      			};

	      			result.$remove = function(obj){

	      				var arr = this;

	      				for (var i = 0; i < arr.length; i++){

	      					if (arr[i] == obj){

	      						arr[i] = undefined;
	      						
	      					}

	      				}

		      			return {

		      				then : function(callback){

		      					var ref = {

		      						name : function(){

		      							return 'AA';

		      						}

		      					};

		      				}

		      			};

	      			};

	      			return result;

	      		};

	      		if (path.match(/A{2}|B{2}/)){

	      			return arrayToReturn( this.fireBaseStruct.decks.AA.noteCards.AA,'AA' );

	      		} else if(path.match(/decks/)){

							return arrayToReturn( this.fireBaseStruct.decks.AA,'AA' );	      			

	      		}

	      	},

	      	asObject : function(path){

	      		var objectToReturn = function(obj){

	      			var result = {};

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

	      			result.$loaded = function(){

	      				return {

	      					then : function(callback){

	      						callback(result);

	      					}

	      				};

	      			};

	      			return result;

	      		};

	      		if (path.match(/A{2}|B{2}/)){

	      			return objectToReturn( this.fireBaseStruct.decks.AA.map );

	      		} else if(path.match(/map/)){

							return objectToReturn( this.fireBaseStruct.map );	      			

	      		}	      		

	      	}

	      })

	    });

		});

		it('gets the decks and stores them',
		inject(function(noteCDataStore){

			var decks;

			noteCDataStore.decks.get().then(function(result){

				decks = result;

			});

			expect( decks['test-deck'] ).toBe('AA');

		}));

		it('gets the cards and stores them',
		inject(function(noteCDataStore){

			var cards = {};

			noteCDataStore.cards.get('test-deck').then(function(result){

				cards['test-deck'] = result;

			});

			expect( cards['test-deck']['test-card'] ).toBe('AA');

		}));

		it('enables getting an individual card',
		inject(function(noteCDataStore){

			var cards = {};

			cards['test-deck'] = noteCDataStore.cards.get('test-deck');

			var card = noteCDataStore.cards.get('test-deck','test-card');

			expect( card.content )

		}));

		iit('enables adding decks',
		inject(function(noteCDataStore){

			var decks;

			noteCDataStore.decks.get().then(function(result){

				decks = result;

			});

			noteCDataStore.decks.add('add-deck','add-description');

			expect( decks['add-deck'] ).toBe('BB');

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