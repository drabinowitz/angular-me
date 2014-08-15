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

      }/*,

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

      }*/

    }

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

      getIndex : function(id){

        return decks.$indexFor(id);

      }

    };

  }])/*.

  factory('noteCDecks',['noteCDataStore',
  function(noteCDataStore){

    return {

      get : function(index){

        var list = noteCDataStore.getDecks();

        if(index){

          return list.$keyAt(index);

        } else {

          return list;

        }

      },

      addDeck : function(title,description){

        var inputDescription = description || '';

        var obj = {

          title : title,

          description : inputDescription

        };

        return noteCDataStore.add(obj);

      },

      addCard : function(deck,title,content){

        var obj {

          title : title,

          content : content

        };

        return noteCDataStore.addCard(deck,obj);

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

  }])*/;