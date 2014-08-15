angular.module('noteCLibrary',['firebase']).

  constant('NOTEC_FIREBASE_URL','https://burning-fire-8322.firebaseio.com/').

  constant('NOTEC_FIREBASE_DECKS','decks').

  constant('NOTEC_FIREBASE_NOTECARDS','decks/deck={{ deckName }}/noteCards').

  factory('noteCFirebaseRequest',['$http','$q','$firebase','NOTEC_FIREBASE_URL',
  function($http,$q,$firebase,NOTEC_FIREBASE_URL){

    var locator = function(location){

      var firebaseRef = new Firebase(NOTEC_FIREBASE_URL + location);

      var sync = $firebase(firebaseRef);

      return sync.$asArray();

    };

    return {

      get : function(location){

        return locator(location);

      },

      add : function(location,obj){

        var list = locator(location);

        var defer = $q.defer();

        list.$add(obj).then(function(ref){

          defer.resolve(list.$indexFor(ref.name()));

        }, function(error){

          defer.reject(error);

        });

        return defer.promise;

      },

      save : function(location,index,name,value){

        var list = locator(location);

        list[index][name] = value;

        var defer = $q.defer();

        list.$save(index).then(function(ref){

          defer.resolve(list.$indexFor(ref.name()));

        }, function(error){

          defer.reject(error);

        });

        return defer.promise;

      },

      remove : function(location,index){

        var list = locator(location);

        var item = list[index];

        var defer = $q.defer();

        list.$remove( item ).then(function(ref){

          defer.resolve(list.$indexFor(ref.name()));

        }, function(error){

          defer.reject(error);

        });

        return defer.promise;

      }

    }

  }]).

  factory('noteCDataStore',['noteCFirebaseRequest','NOTEC_FIREBASE_DECKS','NOTEC_FIREBASE_NOTECARDS',
  function(noteCFirebaseRequest,NOTEC_FIREBASE_DECKS,NOTEC_FIREBASE_NOTECARDS){

    var decks;

    return {

      getDecks : function(){

        if(decks){

          return decks;

        } else {

          decks = noteCFirebaseRequest.get(NOTEC_FIREBASE_DECKS);

          return decks;

        }

      },

      add : function(obj){

        noteCFirebaseRequest.add(NOTEC_FIREBASE_DECKS,obj)

      },

      getIndex : function(id){

        return decks.$indexFor(id);

      }

    };

  }]).

  factory('noteCDecks',['noteCDataStore',
  function(noteCDataStore){

    return {

      get : function(){

        return list = noteCDataStore.getDecks();

      },

      add : function(title,description){

        var inputDescription = description || '';

        var obj = {

          title : title,

          description : inputDescription

        };

        return noteCDataStore.add(obj);

      },

      getIndex : function(id){

        return noteCDataStore.getIndex(id);

      }

    };

  }]).

  factory('noteCNoteCards',['$interpolate','NOTEC_FIREBASE_NOTECARDS','noteCFirebaseRequest',
  function($interpolate,NOTEC_FIREBASE_NOTECARDS,noteCFirebaseRequest){

    return {

      get : function(deck){

        var path = $interpolate(NOTEC_FIREBASE_NOTECARDS)({deckName : deck});

        return list = noteCFirebaseRequest.get(path);

      }

    };

  }]);