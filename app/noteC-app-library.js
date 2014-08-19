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

    // var cards = {};

    function queryForDecks (){

      var defer = $q.defer();

      if(!decks){

        decks = noteCFirebaseRequest.get(NOTEC_FIREBASE_DECKS);

        decks.$loaded(function(){ 

          defer.resolve(decks);

        });

      } else {

        defer.resolve(decks);

      }

      return defer.promise;

    }

    return {

      getDecks : function(){

        return queryForDecks();

      },

      getCards : function(deckName){

        /*if(!cards[deckName]){

          var path = $interpolate(NOTEC_FIREBASE_NOTECARDS)({deckName : deckName});

          cards[deckName] = noteCFirebaseRequest.get(path);

        }*/

        var defer = $q.defer();

        queryForDecks().then(function(){

          defer.resolve(decks[deckName].noteCards);

        });

        return defer.promise;

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

        decks[deckName][title] = {content : inputContent};

        var defer = $q.defer();

        decks[deckName].$save().then(function(ref){

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