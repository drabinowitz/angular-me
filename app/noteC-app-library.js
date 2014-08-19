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

  factory('noteCPromiseGenerator',['$q',function($q){

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

          resolve.apply(null,[defer,result,filter]);

        });

        return defer.promise;

      },

      objectStandard : function(requester,ajaxRequest,filter){

        var defer = $q.defer();

        requester[ajaxRequest]().then(function(result){

          resolve.apply(null,[defer,result,filter]);

        });

        return defer.promise;

      },

      instant : function(data){

        var defer = $q.defer();

        defer.resolve(data);

        return defer.promise;

      }

    };

  }]).

  factory('noteCDataStore',['$q','$interpolate','noteCFirebaseRequest','noteCPromiseGenerator','NOTEC_FIREBASE_DECKS','NOTEC_FIREBASE_NOTECARDS',
  function($q,$interpolate,noteCFirebaseRequest,noteCPromiseGenerator,NOTEC_FIREBASE_DECKS,NOTEC_FIREBASE_NOTECARDS){

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

      getDecks : function(){

        return noteCPromiseGenerator.standard(queryForDecks);

      },

      getCards : function(deckName){

        return noteCPromiseGenerator.standard(function(){

          return queryForCards.apply(null,[deckName]);

        });

      },

      addDeck : function(title,description){

        var inputDescription = description || '';

        decks[title] = {description : inputDescription}

        return noteCPromiseGenerator.objectStandard(decks,'$save');

      },

      addCard : function(deckName,title,content){

        var inputContent = content || '';

        if(!cards[deckName].noteCards){

          cards[deckName].noteCards = {};

        }

        cards[deckName].noteCards[title] = {content : inputContent};

        return noteCPromiseGenerator.objectStandard(cards[deckName],'$save');

/*        var defer = $q.defer();

        decks[deckName].$save().then(function(ref){

          defer.resolve(ref.name());

        }, function(error){

          defer.reject(error);

        });

        return defer.promise;*/

      },

      deleteDeck : function(title){

        delete decks[title];

        var defer = $q.defer();

        decks.$save().then(function(ref){

          defer.resolve(ref.name());

        }, function(error){

          defer.reject(error);

        });

        return defer.promise;

      },

      deleteCard : function(deckName,cardName){

        delete decks[deckName].noteCards[cardName];

        var defer = $q.defer();

        decks.$save().then(function(ref){

          defer.resolve(ref.name());

        }, function(error){

          defer.reject(error);

        });

        return defer.promise;

      }

    };

  }]);