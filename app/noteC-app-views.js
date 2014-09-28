var viewsModule = angular.module('noteCAppViews',['ui.router','ngAnimate','noteCLibrary','noteCDirectives']);

viewsModule.filter('with', function() {

  return function(items, field) {

    field = field || '';

    var regex = new RegExp(".*" + field + ".*", "g");

    var result = {};

    angular.forEach(items, function(value, key) {

        if (key.match(regex) ||

        (value &&

          typeof value === 'object' &&

          (

            (value.hasOwnProperty('description') && value.description.match(regex)) ||

            (value.hasOwnProperty('content') && value.content.match(regex))

          )
        
        )) {

            result[key] = value;

        }

    });

    return result;

  };
  
});