angular.module('noteCLibrary',[]).

  factory('noteCInfo',function(){

    return {

      get : function(){

        return [

          {name : 'title1',

          content : 'text1'},

          {name : 'title2',

          content : 'text2'}

        ];

      }

    }

  });