angular.module('noteCLibrary',['firebase']).

  constant('NOTEC_FIREBASE_URL','https://burning-fire-8322.firebaseio.com/').

  constant('NOTEC_FIREBASE_DECKS','decksArray/decks').

  constant('NOTEC_FIREBASE_DECKS_MAP','decksArray/map').

  constant('NOTEC_FIREBASE_NOTECARDS','decksArray/{{ deckName }}/noteCards').

  constant('NOTEC_FIREBASE_NOTECARDS_MAP','decksArray/{{ deckName }}/map').

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

    var cards = {};

    function queryForDecks (){

      if(!decks){

        decks = noteCFirebaseRequest.asObject(NOTEC_FIREBASE_DECKS);

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

      decks : {

        get : function(deckName){

          var decksToReturn = function(decks){ return decks.map };

          if(deckName){

            decksToReturn = function(decks){

              return decks[decks.map[deckName]];

            };

          }

          return noteCPromiseGenerator.standard(queryForDecks,decksToReturn);

        },

        add : function(title,description){

          if(decks.map[title] == undefined){

            var inputDescription = description || '';

            decks[title] = {description : inputDescription}

            return noteCPromiseGenerator.standard(function(){

              decks.$add({

                title : title,

                description : description

              });

            },function(ref){

              decks.map[title] = 

            });

          }

        },

        edit : function(title,editTitle,editDescription){

          if(title == editTitle){

            decks[title].description = editDescription;

            return noteCPromiseGenerator.objectStandard(decks,'$save');

          } else if (decks[editTitle] == undefined){

            var dataStore = this;

            decks[editTitle] = decks[title];

            decks[editTitle].description = editDescription;

            return this.remove(title);

          }

        },

        remove : function(title){

          for (var i = 0; i < arguments.length; i++){

            delete decks[arguments[i]];

          }

          return noteCPromiseGenerator.objectStandard(decks,'$save');

        }

      },

      cards : {

        get : function(deckName,cardTitle){

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

        add : function(deckName,title,content){

          if(cards[deckName][title] == undefined){

            var inputContent = content || '';

            cards[deckName][title] = {content : inputContent};

            return noteCPromiseGenerator.objectStandard(cards[deckName],'$save');

          }

        },

        edit : function(deckName,title,editTitle,editContent){

          if(title == editTitle){

            cards[deckName][title].content = editContent;

            return noteCPromiseGenerator.objectStandard(cards[deckName],'$save');

          } else if (cards[deckName][editTitle] == undefined){

            var dataStore = this;

            cards[deckName][editTitle] = cards[deckName][title];

            cards[deckName][editTitle].content = editContent;

            return this.remove(deckName,title);

          }

        },

        remove : function(deckName,title){

          for(var i = 1; i < arguments.length; i++){

            delete cards[deckName][arguments[i]];

          }
              
          return noteCPromiseGenerator.objectStandard(cards[deckName],'$save');

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