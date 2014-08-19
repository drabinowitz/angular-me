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

  factory('noteCDataStore',['$q','$interpolate','noteCFirebaseRequest','noteCPromiseGenerator','NOTEC_FIREBASE_DECKS',
  function($q,$interpolate,noteCFirebaseRequest,noteCPromiseGenerator,NOTEC_FIREBASE_DECKS){

    var decks;

    function queryForDecks (){

      if(!decks){

        decks = noteCFirebaseRequest.get(NOTEC_FIREBASE_DECKS);

        return noteCPromiseGenerator.objectStandard(decks,'$loaded');

      } else {

        return noteCPromiseGenerator.instant(decks);

      }

    }

    return {

      getDecks : function(){

        return queryForDecks();

      },

      getCards : function(deckName){

        return noteCPromiseGenerator.standard(queryForDecks,function(data){

          return data[deckName].noteCards;

        });

/*        var defer = $q.defer();

        queryForDecks().then(function(){

          defer.resolve(decks[deckName].noteCards);

        });

        return defer.promise;*/

      },

      addDeck : function(title,description){

        var inputDescription = description || '';

        decks[title] = {description : inputDescription}

        noteCPromiseGenerator.Objectstandard(decks,'$save');

/*        var defer = $q.defer();

        decks.$save().then(function(ref){

          defer.resolve(ref.name());

        }, function(error){

          defer.reject(error);

        });

        return defer.promise;*/

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