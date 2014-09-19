angular.module('noteCLibrary',['firebase']).

  constant('NOTEC_FIREBASE_URL','https://burning-fire-8322.firebaseio.com/').

  constant('NOTEC_FIREBASE_DECKS','decks').

  constant('NOTEC_FIREBASE_DECKS_MAP','map').

  constant('NOTEC_FIREBASE_NOTECARDS','decks/{{ deckName }}/noteCards').

  constant('NOTEC_FIREBASE_NOTECARDS_MAP','decks/{{ deckName }}/map').

  factory('noteCFirebaseRequest',['$firebase','NOTEC_FIREBASE_URL',
  function($firebase,NOTEC_FIREBASE_URL){

    var locator = function(location,isArray){

      var firebaseRef = new Firebase(NOTEC_FIREBASE_URL + location);

      var sync = $firebase(firebaseRef);

      if (isArray){

        return sync.$asArray();
        
      } else {

        return sync.$asObject();

      }

    };

    return {

      asArray : function(location){

        return locator(location,true);

      },

      asObject : function(location){

        return locator(location,false);

      }

    };

  }]).

  factory('noteCPromiseGenerator',['$q','$timeout',function($q,$timeout){

    function resolve(deferred,result,filter){

      if(filter){

        deferred.resolve(filter(result));

      } else {

        deferred.resolve(result);

      }

    }

    return {

      standard : function(ajaxRequest,filter){

        var defer = $q.defer();

        ajaxRequest().then(function(result){

          resolve(defer,result,filter);

        });

        return defer.promise;

      },

      objectStandard : function(requester,ajaxRequest,filter){

        var defer = $q.defer();

        requester[ajaxRequest]().then(function(result){

          resolve(defer,result,filter);

        });

        return defer.promise;

      },

      instant : function(data,filter){

        var defer = $q.defer();

        if(filter == undefined){

          $timeout(function(){

            defer.resolve(data);

          });

        } else {

          $timeout(function(){

            defer.resolve(filter(data));

          });

        }

        return defer.promise;

      }

    };

  }]).

  factory('noteCDataStore',['$interpolate','noteCFirebaseRequest','noteCPromiseGenerator','NOTEC_FIREBASE_DECKS','NOTEC_FIREBASE_DECKS_MAP','NOTEC_FIREBASE_NOTECARDS','NOTEC_FIREBASE_NOTECARDS_MAP',
  function($interpolate,noteCFirebaseRequest,noteCPromiseGenerator,NOTEC_FIREBASE_DECKS,NOTEC_FIREBASE_DECKS_MAP,NOTEC_FIREBASE_NOTECARDS,NOTEC_FIREBASE_NOTECARDS_MAP){

    var decks;

    var deckMap;

    var cards = {};

    function queryForDecks (){

      if(typeof decks === 'undefined'){

        decks = noteCFirebaseRequest.asArray(NOTEC_FIREBASE_DECKS);

        deckMap = noteCFirebaseRequest.asObject(NOTEC_FIREBASE_DECKS_MAP);

        return noteCPromiseGenerator.objectStandard(deckMap,'$loaded');

      } else {

        return noteCPromiseGenerator.instant(deckMap);

      }

    }

    function queryForCards(deckName){

      function request(){

        var cardsPath = $interpolate(NOTEC_FIREBASE_NOTECARDS)({deckName : deckMap[deckName]});

        var cardsMapPath = $interpolate(NOTEC_FIREBASE_NOTECARDS_MAP)({deckName : deckMap[deckName]});

        cards[deckName].list = noteCFirebaseRequest.asArray(cardsPath);

        cards[deckName].map = noteCFirebaseRequest.asObject(cardsMapPath);

        return noteCPromiseGenerator.objectStandard(cards[deckName].map,'$loaded');

      }

      if(typeof cards[deckName] === 'undefined'){

        cards[deckName] = {};

        if (typeof deckMap === 'undefined'){

          return queryForDecks().then(request);

        } else {

          return request();

        }

      } else {

        return noteCPromiseGenerator.instant(cards[deckName].map);

      }

    }

    return {

      decks : {

        get : function(deck){

          var decksToReturn = function(deckMap){ return deckMap };

          if(deck){

            decksToReturn = function(deckMap){

              return decks.$getRecord(deckMap[deck]);

            };

          }

          return noteCPromiseGenerator.standard(queryForDecks,decksToReturn);

        },

        add : function(title,description){

          if (typeof deckMap[title] === 'undefined'){

            var inputDescription = description || '';

            return noteCPromiseGenerator.standard(function(){

              return decks.$add({

                title : title,

                description : inputDescription

              });

            },function(ref){

              deckMap[title] = ref.name();

              deckMap.$save();
              
            });

          }

        },

        edit : function(title,editTitle,editDescription){

          var deck = decks.$getRecord(deckMap[title]);

          deck.description = editDescription;

          if (title !== editTitle && typeof deckMap[editTitle] === 'undefined'){

            deck.title = editTitle

            deckMap[editTitle] = deck.$id;

            delete deckMap[title];

            deckMap.$save();

            title = editTitle;           

          }

          decks.$save(decks.$indexFor(deckMap[title]));

        },

        remove : function(title){

          var deck;

          for (var i = 0; i < arguments.length; i++){

            if (typeof deckMap[title] !== 'undefined'){

              deck = decks.$getRecord(deckMap[title]);

              decks.$remove(deck);

              delete deckMap[title];
              
            }

          }

          deckMap.$save();

        }

      },

      cards : {

        get : function(deckName,cardTitle){

          var cardsToReturn = function (cardMap){ return cardMap };

          if(cardTitle){

            cardsToReturn = function(cardMap){

              return cards[deckName].list.$getRecord(cards[deckName].map[cardTitle]);

            };

          }

          return noteCPromiseGenerator.standard(function(){

            return queryForCards(deckName);

          },cardsToReturn);

        },

        add : function(deckName,title,content){

          var inputContent = content || '';

          if (typeof cards[deckName].map[title] === 'undefined'){

            return noteCPromiseGenerator.standard(function(){

              return cards[deckName].list.$add({

                title : title,

                content : inputContent

              });

            },function(ref){

              cards[deckName].map[title] = ref.name();

              cards[deckName].map.$save();
              
            });

          }

        },

        edit : function(deckName,title,editTitle,editContent){

          var addToMap;

          if(typeof cards[deckName].map[editTitle] === 'undefined'){

            cards[deckName].list.$getRecord(cards[deckName].map[title]).title = editTitle;

            addToMap = function(ref){

              delete cards[deckName].map[title];

              cards[deckName].map[editTitle] = ref.name();

              cards[deckName].map.$save();
                
            };

          }

          cards[deckName].list.$getRecord(cards[deckName].map[title]).content = editContent;

          return noteCPromiseGenerator.standard(function(){

            return cards[deckName].list.$save(cards[deckName].list.$indexFor(cards[deckName].map[title]));

          },addToMap);

        },

        remove : function(deckName,title){

          var removeArgs = arguments;

          var mapHandler = function(input){

            return function(){

              delete cards[deckName].map[removeArgs[input]];

              cards[deckName].map.$save();

            };

          };

          for(var i = 1; i < removeArgs.length; i++){

            noteCPromiseGenerator.standard(function(){

              return cards[deckName].list.$remove(cards[deckName].list.$getRecord(cards[deckName].map[removeArgs[i]]));

            },mapHandler(i));

          }
              
        }
        
      }

/*      getCard : function(deckName,cardTitle){

        return noteCPromiseGenerator.standard(function(){

          return queryForCards(deckName);

        },function(cards){

          return cards[cardTitle];

        });

      },*/

      

    };

  }]);