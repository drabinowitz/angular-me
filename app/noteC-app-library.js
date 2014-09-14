angular.module('noteCLibrary',['firebase']).

  constant('NOTEC_FIREBASE_URL','https://burning-fire-8322.firebaseio.com/').

  constant('NOTEC_FIREBASE_DECKS','decks').

  constant('NOTEC_FIREBASE_NOTECARDS','decks/{{ deckName }}/noteCards').

  factory('noteCFirebaseRequest',['$firebase','NOTEC_FIREBASE_URL',
  function($firebase,NOTEC_FIREBASE_URL){

    var locator = function(location){

      var firebaseRef = new Firebase(NOTEC_FIREBASE_URL + location);

      var sync = $firebase(firebaseRef);

      return sync.$asObject();

    };

    return {

      get : function(location){

        return locator(location);

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

  factory('noteCDataStore',['$interpolate','noteCFirebaseRequest','noteCPromiseGenerator','NOTEC_FIREBASE_DECKS','NOTEC_FIREBASE_NOTECARDS',
  function($interpolate,noteCFirebaseRequest,noteCPromiseGenerator,NOTEC_FIREBASE_DECKS,NOTEC_FIREBASE_NOTECARDS){

    var decks;

    var cards = {};

    function queryForDecks (){

      if(!decks){

        decks = noteCFirebaseRequest.get(NOTEC_FIREBASE_DECKS);

        return noteCPromiseGenerator.objectStandard(decks,'$loaded');

      } else {

        return noteCPromiseGenerator.instant(decks);

      }

    }

    function queryForCards(deckName){

      if(!cards[deckName]){

        var path = $interpolate(NOTEC_FIREBASE_NOTECARDS)({deckName : deckName});

        cards[deckName] = noteCFirebaseRequest.get(path);

        return noteCPromiseGenerator.objectStandard(cards[deckName],'$loaded');

      } else {

        return noteCPromiseGenerator.instant(cards[deckName]);

      }

    }

    return {

      getDecks : function(deckName){

        var decksToReturn = function(decks){ return decks };

        if(deckName){

          decksToReturn = function(decks){

            return decks[deckName];

          };

        }

        return noteCPromiseGenerator.standard(queryForDecks,decksToReturn);

      },

      getCards : function(deckName,cardTitle){

        var cardsToReturn = function (cards){ return cards };

        if(cardTitle){

          cardsToReturn = function(cards){

            return cards[cardTitle];

          };

        }

        return noteCPromiseGenerator.standard(function(){

          return queryForCards(deckName);

        },cardsToReturn);
        
      },

/*      getCard : function(deckName,cardTitle){

        return noteCPromiseGenerator.standard(function(){

          return queryForCards(deckName);

        },function(cards){

          return cards[cardTitle];

        });

      },*/

      addDeck : function(title,description){

        if(decks[title] == undefined){

          var inputDescription = description || '';

          decks[title] = {description : inputDescription}

          return noteCPromiseGenerator.objectStandard(decks,'$save');

        }

      },

      addCard : function(deckName,title,content){

        if(cards[deckName][title] == undefined){

          var inputContent = content || '';

          cards[deckName][title] = {content : inputContent};

          return noteCPromiseGenerator.objectStandard(cards[deckName],'$save');

        }

      },

      deleteDeck : function(title){

        delete decks[title];

        return noteCPromiseGenerator.objectStandard(decks,'$save');

      },

      deleteCard : function(deckName,title){

        delete cards[deckName][title];

        return noteCPromiseGenerator.objectStandard(cards[deckName],'$save');

      },

      editDeck : function(title,editTitle,editDescription){

        if(title == editTitle){

          decks[title].description = editDescription;

          return noteCPromiseGenerator.objectStandard(decks,'$save');

        } else if (decks[editTitle] == undefined){

          var dataStore = this;

          decks[editTitle] = decks[title];

          decks[editTitle].description = editDescription;

          return dataStore.deleteDeck(title);

        }

      },

      editCard : function(deckName,title,editTitle,editContent){

        if(title == editTitle){

          cards[deckName][title].content = editContent;

          return noteCPromiseGenerator.objectStandard(cards[deckName],'$save');

        } else if (cards[deckName][editTitle] == undefined){

          var dataStore = this;

          cards[deckName][editTitle] = cards[deckName][title];

          cards[deckName][editTitle].content = editContent;

          return dataStore.deleteCard(deckName,title);

        }

      }

    };

  }]);