angular.module('noteCLibrary',['firebase']).

  constant('NOTEC_FIREBASE_URL','https://burning-fire-8322.firebaseio.com/').

  constant('NOTEC_FIREBASE_DECKS','decks').

  constant('NOTEC_FIREBASE_NOTECARDS','decks/{{ deckName }}/noteCards').

  factory('noteCFirebaseRequest',['$http','$q','$firebase','NOTEC_FIREBASE_URL',
  function($http,$q,$firebase,NOTEC_FIREBASE_URL){

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

  factory('noteCDataStore',['$q','$interpolate','noteCFirebaseRequest','NOTEC_FIREBASE_DECKS','NOTEC_FIREBASE_NOTECARDS',
  function($q,$interpolate,noteCFirebaseRequest,NOTEC_FIREBASE_DECKS,NOTEC_FIREBASE_NOTECARDS){

    var decks;

    var cards = {};

    return {

      getDecks : function(){

        if(!decks){

          decks = noteCFirebaseRequest.get(NOTEC_FIREBASE_DECKS);

        }

        return decks;

      },

      getCards : function(deckName){

        if(!cards[deckName]){

          var path = $interpolate(NOTEC_FIREBASE_NOTECARDS)({deckName : deckName});

          cards[deckName] = noteCFirebaseRequest.get(path);

        }

        return cards[deckName];

      },

      addDeck : function(title,description){

        var inputDescription = description || '';

        decks[title] = {description : inputDescription}

        var defer = $q.defer();

        decks.$save().then(function(ref){

          defer.resolve(ref.name());

        }, function(error){

          defer.reject(error);

        });

        return defer.promise;

      },

      addCard : function(deckName,title,content){

        var inputContent = content || '';

        cards[deckName][title] = {content : inputContent};

        var defer = $q.defer();

        cards[deckName].$save().then(function(ref){

          defer.resolve(ref.name());

        }, function(error){

          defer.reject(error);

        });

        return defer.promise;

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

      deleteCard : function(deckTitle,title){

        delete decks[deckTitle][title];

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