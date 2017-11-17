/*this file contain the actual mapping code w.r.to feature file. It will have actual code which will inturn iteract with 
library and page files to perform desired operation on the application. For sample ex see below*/

"use strict";
var webdriver = require('selenium-webdriver');
var config = require('config');
var Yadda = require('yadda');
var funLib = require('../../../lib/function-library.js');
var excelLib = require('../../../lib/excel-util.js');
var functionLibrary, excelUtil, pdfDocument, pdfPText;

const txtPath = config.get('textFilePath');
const exlpath = config.get('excelPath');
const pdfpath = config.get('pdfPath');
var excelData;

module.exports = (function () {
    var dictionary = new Yadda.Dictionary()
        .define('LOCALE', /(fr|es|ie)/)
        .define('NUM', /(\d+)/);

    var library = new Yadda.localisation.English.library(dictionary)
            .given("User check the file exist", function () {
                    functionLibrary = new funLib(this.driver);
                    functionLibrary.fnLogInfo(txtPath);
                    functionLibrary.fnVerifyFileExist(txtPath);
            })
            .when("User Append data in text file", function () {
                functionLibrary.fnAppendFile(txtPath, "Editing text file for testing\n", "utf8");
            })
            .then("User read data from text file", function () {
                var data = functionLibrary.fnReadFile(txtPath, "utf8");
                console.log(data)
            })
            .given("User get the excel instance", function () {
                excelUtil = new excelLib();
                excelUtil.fnExcelGetInstance();
            })
            .when("User Get cell data", function () {
                excelUtil.fnExcelGetCellData(exlpath, "Sheet1", 6, 1)
                    .then(function (cellValue) {
                        excelData = cellValue;
                    });

                //This is needed for excel to return data. Issue with excelJs and Yadda
                functionLibrary.fnwait(5000); 
            })
            .then("User Verify cell data", function (value) {
                functionLibrary.fnCompareData(excelData, "ALM,Jira,VSS,SVN","Fail - Text not found in xls.");
            })
            .then("User enter and save excel sheet", function () {
                excelUtil.fnExcelEnterDatainemptyrow(exlpath, "Sheet1", "For Testing");
            })
            .given("User get the PDF instance", function () {
                return functionLibrary.fnPdfGetInstance(pdfpath).then(function (pdfdoc) {
                    pdfDocument = pdfdoc;
                });
            })
            .when("User Pass the Page Number", function () {
                functionLibrary.fnLogInfo("User Pass the Page Number "+pdfDocument);
                functionLibrary.fnPdfTextPage(39,pdfDocument).then(function (pageText) {
                    pdfPText = pageText;
                });
            })
            .then("User Get the data and verify with text", function () {
                functionLibrary.fnTextcontainVerification(pdfPText, "Percentile Median");
            });

    return library;
})();