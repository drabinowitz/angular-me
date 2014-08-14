var repackageFirebase = function(list){

  var arrList = [];

  for(item in list){

    arrList.push({

      title : list[item].title,

      description : list[item].description,

      number : item

    }

  }

  return arrList;

};