/*this file contain the actual mapping code w.r.to feature file. It will have actual code which will inturn iteract with 
library to perform desired operation on the application. For sample ex see below*/

"use strict";
var Yadda = require('yadda');
var apiLib = require('../../../lib/api-library.js');
var add = require('../../../src/example/commons/common.js')
var  APILibrary;
var arr1 =[];
module.exports = (function () {
    var dictionary = new Yadda.Dictionary()
        .define('LOCALE', /(fr|es|ie)/)
        .define('NUM', /(\d+)/);
    var library = new Yadda.localisation.English.library(dictionary)

    /*
    * Start of Scenarios for API verification
    */
    
    .given("User Executes APITests from $sheetName", function (sheetName) {
         arr1 = add(arr1,"initial message")
       APILibrary = new apiLib(arr1);
       // var dictObj = APILibrary.fnexecuteApiTests(sheetName);
       
        APILibrary.fnexecuteApiTests(sheetName).then(function(dict){
             //console.log("array in api-step.js-"+dict.length)
        })
  arr1 = add(arr1,"final message")
       
                 
    })
    
.then("User print result",function(){
    console.log("array in api-step.js-"+arr1)
})

      return library;
})();