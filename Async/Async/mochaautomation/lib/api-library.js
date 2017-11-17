var webdriver = require('selenium-webdriver');
var fs = require('fs');
var assert = require('assert');
var config = require('config');
var excelLib = require('./excel-util.js');
var funLib = require('./function-library.js');
const apiExcelPath = config.get('apiExcelPath');
var supertest = require("supertest");
var expect = require('chai').expect;
var Promise = require('promise');
var add = require('../src/example/commons/common.js')
const txtPath = config.get('textFilePath');

functionLibrary = new funLib(this.driver);
var arr =[];
var dict = [];


APILibrary = function APILibrary(arr1) {arr=arr1 ; console.log("array in api lib is"+arr)};

/*
 * # Function Name: fnexecuteApiTests
 * 
 * # Author:NIX Team
 * 
 * # Description:This function will execute api test cases as per sheetName given . apiExcelPath to be given in config file
 * 
 * # Input Parameters: String :sheetName : Name of the sheet
 * 					   
 */
APILibrary.prototype.fnexecuteApiTests = function (sheetName) {
    var promDefer = webdriver.promise.defer();
    excelUtil = new excelLib();
    excelUtil.fnExcelGetInstance();
    excelUtil.fnGetUsedRowNum(apiExcelPath, sheetName).then((usedRowNum) => {

        for (var i = 2; i <=usedRowNum; i++) {
            var apidomain = excelUtil.fnExcelGetCellData(apiExcelPath, sheetName, i, 2);
            var apiPath = excelUtil.fnExcelGetCellData(apiExcelPath, sheetName, i, 3);
            var authentication = excelUtil.fnExcelGetCellData(apiExcelPath, sheetName, i, 4);
            var operationType = excelUtil.fnExcelGetCellData(apiExcelPath, sheetName, i, 5);
            var inputs = excelUtil.fnExcelGetCellData(apiExcelPath, sheetName, i, 6);
            var expctdStatus = excelUtil.fnExcelGetCellData(apiExcelPath, sheetName, i, 7);
            var responseParams = excelUtil.fnExcelGetCellData(apiExcelPath, sheetName, i, 8);
            var validationParams = excelUtil.fnExcelGetCellData(apiExcelPath, sheetName, i, 9);

            Promise.all([
                apidomain,
                apiPath,
                authentication,
                operationType,
                inputs,
                expctdStatus,
                responseParams,
                validationParams,
                i,
                usedRowNum,
                dict
            ]).then(values => {
                this.fnTestApi(values);
               // promDefer.fulfill(dict);
                return dict;
            })
                // .then(values => {
                //     //this.fnWriteExcel(values);
                //     //promDefer.fulfill(dict);
                //    // return dict;

                 //})
                 .catch(error => {
                    promDefer.reject(error);
                    functionLibrary.fnLogError("Error - " + error);
                });
        }


    });
    return promDefer.promise;
};

/*
 * # Function Name: fnTestApi
 * 
 * # Author:NIX Team
 * 
 * # Description:This function will test api for various requests . It is used internally by APILibrary , not be called from outside
 * 
 * # Input Parameters:values array
 * 					   
 */

APILibrary.prototype.fnTestApi = function (values) {
    //var d = webdriver.promise.defer();
  
    var apidomain = values[0].text;
    var apiPath = values[1]
    var authentication = values[2]
    var operationType = values[3]
    var inputs = values[4]
    var expctdStatus = values[5]
    var responseParams = values[6]
    var validationParams = values[7]
    var rowNum = values[8]
    var arraySize = values[9]
    var isValidApiURL = false;

    if (!apidomain | !apiPath | !authentication | !operationType | !inputs | !expctdStatus | responseParams | validationParams) {
        functionLibrary.fnLogError("Error - Invalid inputs ! Please check excel sheet for any blank entries");
        assert.fail(true, false, "Invalid inputs ! Please check excel sheet for any blank entries");
    }

    validationParams = validationParams.replace("\r", "");
    validationParams = validationParams.split("\n");
    responseParams = responseParams.replace("\r", "");
    responseParams = responseParams.split("\n");
    var validationFlag = !(validationParams[0] === "NA");
    var responseFlag = !(responseParams[0] === "NA");




    var request = supertest(apidomain)
    var res;
    switch (operationType) {
        case "GET":
            if (inputs !== "NA") {
                apiPath = apiPath + "?" + inputs;
            }
            res = request.get(apiPath)
            break;
        case "POST":
            res = request.post(apiPath)
                .type('JSON')
                .send(inputs);
            break;
        case "DELETE":
            if (inputs !== "NA") {
                apiPath = apiPath + "?" + inputs;
            }
            res = request.delete(apiPath)
            break;
    }

    if (typeof res != 'undefined') {
        res.end((err, res) => {
            functionLibrary.fnLogInfo('Validating ' + res.status + 'to be ' + expctdStatus);
            //expect(res.status).to.equal(expctdStatus);
            this.fnVerifyApiResponse(responseFlag, validationFlag, responseParams, validationParams, res, rowNum, arraySize);
            //d.fulfill(true);
        });

    }
    else {
        functionLibrary.fnLogError("Error - Invalid response , please check server url");
        assert.fail(true, false, "Invalid response , please check server url");
    }
   // d.fulfill(true);
}

/*
 * # Function Name: fnGetJsonDataFromKeyPath
 * 
 * # Author:NIX Team
 * 
 * # Description:This method parse response body to find the json key , retuns value of the key
 * 
 * # Input Parameters:String data : API response body
 *                    String path : Path of key (json key as expected in response body)
 * 					   
 */

APILibrary.prototype.fnGetJsonDataFromKeyPath = function (data, path) {
    var pathArr = path.replace("[", ".").replace("]", "").split(".");
    var val = data;
    pathArr.forEach(function (path) {
        val = val[path];
    });
    return val;

}

/*
 * # Function Name: fnVerifyApiResponse
 * 
 * # Author:NIX Team
 * 
 * # Description:This method verify api responses
 * 
 * # Input Parameters:String responseFlag
 *                    String validationFlag
 * 					   
 */

APILibrary.prototype.fnVerifyApiResponse = function (responseFlag, validationFlag, responseParams, validationParams, res, rowNum, arraySize) {
    //var d = webdriver.promise.defer();
    if (responseFlag) {
        responseParams.forEach((response) => {
            response.replace("\r", "");
            var val = this.fnGetJsonDataFromKeyPath(res.body, response)

            //functionLibrary.fnLogInfo('Validating-' + response + '-to be present in response body');
            //expect(val).to.not.be.an('undefined');
        })
    }
    if (validationFlag) {
            validationParams.forEach((validation) => {
            validation.replace("\r", "");
            input = validation.split("=")[0];
            expected = validation.split("=")[1];
            var val = this.fnGetJsonDataFromKeyPath(res.body, input)
           // functionLibrary.fnLogInfo('Validating-' + input + '-to be equal to-' + expected + "for row->" + rowNum);
            
            if(val==expected)
            {
                    //dict.push({ id: rowNum, value: 'PASS - Validating-' + input + '-to be equal to-' + expected + "for row->" + rowNum });
                    //arr.push({ id: rowNum, value: 'PASS - Validating-' + input + '-to be equal to-' + expected + "for row->" + rowNum });
                    arr=add(arr,'Validating-' + input + '-to be equal to-' + expected)
            }
            else
            {
                    //dict.push({ id: rowNum, value: 'FAIL - Validating-' + input + '-to be equal to-' + expected + "for row->" + rowNum });
                    //arr.push({ id: rowNum, value: 'FAIL - Validating-' + input + '-to be equal to-' + expected + "for row->" + rowNum });
                     arr=add(arr,'Validating-' + input + '-to be equal to-' + expected)
            }
            
            if (arr.length == arraySize - 1) {
                
                var path = ".\\src\\example\\datafile\\SampleExcel.xlsx";
                //excelUtil.fnExcelGetInstance();
               // excelUtil.fnExcelData2(path, "ApiInputs", dict).then(function(){});
            }

            //d.fulfill(dict);

        })
        //d.fulfill(dict);
    }
}

module.exports = APILibrary; 
