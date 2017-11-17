/*this file contain the actual mapping code w.r.to feature file. It will have actual code which will inturn iteract with
library and page files to perform desired operation on the application. For sample ex see below*/

"use strict";
var webdriver = require('selenium-webdriver');
var config = require('config');
var Yadda = require('yadda');
var funLib = require('../../../lib/function-library.js');
var url = config.get('intranet.url');
var Example = require('../page/example-page.js');
var examplePage, functionLibrary;
const image1= config.get('image1');
const image2 = config.get('image2');

const tableData = "VALE@9.99@-0.4@33.8M@INFY@14.56@-1.6@25.7M@VIPS@9.27@-6@30.7M@BABA@169.25@-1@22.4M@JMEI@3.28@-6.8@19.4M@JD@41.26@2.8@17.2M";

module.exports = (function () {
    var dictionary = new Yadda.Dictionary()
        .define('LOCALE', /(fr|es|ie)/)
        .define('NUM', /(\d+)/);
    var library = new Yadda.localisation.English.library(dictionary)

    /*
    * Start of Scenarios for Actions Verification in Function Library
    */
     .given("User is on TAF Example Page", function () {
            if(this.customUrl){
                url = this.customUrl;
            }

	        functionLibrary = new funLib(this.driver);
            functionLibrary.fnLogInfo('In User is on the TAF Example Page');
            functionLibrary.fnLogInfo("url::" + url);
            examplePage = new Example(this.driver);
            functionLibrary.fnOpenUrl(url);
            
        })
    .when("The hidden text is visible", function () {
	       functionLibrary.fnLogInfo('In when The hidden text is visible');
           functionLibrary.fnWaitTillElementVisible(examplePage.hiddenText,15000);
           functionLibrary.fnVerifyElementExistenceWithText(examplePage.hiddenText,"This text gets visible after 10 seconds of page load");
        })
    .then("User enter text in Text box clears the text and enter the text again", function () {
		    functionLibrary.fnLogInfo('In User enter text in Text box');
            functionLibrary.fnClick(examplePage.textBox);
            functionLibrary.fnSendKeys(examplePage.textBox,"enter text here");
            functionLibrary.fnClear(examplePage.textBox);
            functionLibrary.fnSendKeys(examplePage.textBox,"enter text again");
     })
    .then("User selects options from select menu", function () {
		    functionLibrary.fnLogInfo('In User selects Options from the select menu');
            functionLibrary.fnClick(examplePage.selectlist);
            functionLibrary.fnSelectValueFromDropDown(examplePage.selectlist,"Options");
    })
    .then("User select Mutual Funds and ETFs checkbox", function () {
		functionLibrary.fnLogInfo('In User select Mutual Funds and ETFs checkbox');
        functionLibrary.fnCheckCheckbox(examplePage.checkboxETFs);
        functionLibrary.fnCheckCheckbox(examplePage.checkboxMutualFunds);

     })
    .then("User uncheck ETFs checkbox", function () {
		functionLibrary.fnLogInfo('In User uncheck ETFs checkbox');
        functionLibrary.fnUncheckCheckbox(examplePage.checkboxETFs);
     })
    .then("User selects Options radio button", function () {
		    functionLibrary.fnLogInfo('In User selects Options radio button');
            functionLibrary.fnSelectRadioButton(examplePage.radiobuttonOptions,"option3");
    })
    .then("User performs mouseover on hover text", function () {
		    functionLibrary.fnLogInfo('In User performs mouseover on hover text');
            functionLibrary.fnMouseOver(examplePage.hoverElement);
    })
    .then("User scrolls the page to bottom", function () {
		    functionLibrary.fnLogInfo('In User scrolls the page to bottom');
            functionLibrary.fnScrollPage("DOWN","500");
     })
    .then("User clicks on link to open new window and switch back to parent window", function () {
		   functionLibrary.fnLogInfo('In User clicks on link to open new window and switch back to parent window');
           var windowHandle = this.driver.getWindowHandle();
           functionLibrary.fnClick(examplePage.linktoNewWindow);
           functionLibrary.fnSwitchToNewlyOpenedWindow();
           functionLibrary.fnClick(examplePage.textBox);
           functionLibrary.fnSendKeys(examplePage.textBox,"text in new window");
           functionLibrary.fnSwitchToParentWindow(windowHandle);
           functionLibrary.fnClick(examplePage.textBox);
           functionLibrary.fnSendKeys(examplePage.textBox,"text in parent window");
           functionLibrary.fnSelectValueFromDropDown(examplePage.selectlist,"Mutual Funds");
    })
    .then("User enters text in the text box inside iframe", function () {
		functionLibrary.fnLogInfo('In User enters text in the text box inside iframe');
        functionLibrary.fnSwitchToFrame(examplePage.frame1);
        functionLibrary.fnClick(examplePage.textBox);
        functionLibrary.fnSendKeys(examplePage.textBox,"enter text in text box inside iframe");
    })
    .then("User switch to top frame and selects Mutual Funds", function () {
        functionLibrary.fnLogInfo('User switch to top frame and selects Mutual Funds');
        functionLibrary.fnSwitchToTopFrame();
        functionLibrary.fnSelectValueFromDropDown(examplePage.selectlist,"Mutual Funds");
    })
    /*
    * Start of Scenarios for Verify Functions Verification in Function Library
    */
    .given("User is on the Example Page", function () {
        functionLibrary = new funLib(this.driver);
        functionLibrary.fnLogInfo('Given User is on the Home Page');
        examplePage = new Example(this.driver);
        functionLibrary.fnOpenUrl(url);
    })
    .then("User verifies elements on the page", function () {
        functionLibrary.fnLogInfo('Then User verifies elements on the page');
        functionLibrary.fnVerifyElementExistenceWithText(examplePage.heading, 'Test Automation Example Page');
        functionLibrary.fnVerifyElementExistenceWithPartialText(examplePage.heading, 'Test Automation');
        functionLibrary.fnVerifyElementExistence(examplePage.heading, 'Heading');
    })
    .then("User verifies dropdown options", function () {
        functionLibrary.fnLogInfo('Then User verifies dropdown options');
        functionLibrary.fnVerifyDropdownOptions(examplePage.dropdown, 'ETFs@Mutual Funds@Options');
    })
    .then("User verifies state of element", function () {
        functionLibrary.fnLogInfo('Then User verifies state of element');
        functionLibrary.fnVerifyStateOfWebelement(examplePage.etf, 'Enable');
    })
    .then("User verifies headers and data of webtable", function () {
        functionLibrary.fnLogInfo('Then User verifies headers of webtable');
        functionLibrary.fnVerifyHeadersOfwebtable(examplePage.webtableHeader, 1, 'Symbol@Last Price@Change %@Volume');

        functionLibrary.fnLogInfo('Then User verifies data of webtable');
        functionLibrary.fnVerifyDataOfWebtable(examplePage.webtableBody, tableData);
    })
    .then("User verifies date format", function () {
        functionLibrary.fnLogInfo('Then User verifies date format');
        functionLibrary.fnVerifyDateFormatOfMMDDYYYY(examplePage.date);
    })
    .then("User verifies element attribute", function () {
        functionLibrary.fnLogInfo('Then User verifies element attribute');
        functionLibrary.fnVerificationOfElementAttributeValue(examplePage.link, 'class', 'link');
    })
    .then("User verifies element color", function () {
        functionLibrary.fnLogInfo('Then User verifies element color');
        functionLibrary.fnVerifyElementColor(examplePage.link, 'rgba(65, 131, 196, 1)');
    })
    /*
    * Start of Scenarios for Data Functions Verification in Function Library
    */
    .when("User generates random alphanumeric string", function () {
        functionLibrary.fnLogInfo('Then User verifies date format');
        functionLibrary.fnLogInfo("Random String is - " + functionLibrary.fnGenerateRandomAlphaNumericString(6));
    })
    .when("User gets element text on the page", function () {
        functionLibrary.fnLogInfo('User gets element text on the page');
        functionLibrary.fnGetElementText(examplePage.heading).then(function (str) {
            functionLibrary.fnLogInfo("Element text is - " + str);
        })
    })
    .when("User gets headers text of webtable on the page", function () {
        functionLibrary.fnLogInfo('User gets headers text of webtable on the page');
        functionLibrary.fnGetHeadersOfWebtable(examplePage.webtableHeader, 1).then(function (str) {
            functionLibrary.fnLogInfo("Webtable Headers text are " + str);
        })
    })
    .when("User gets data of webtable on the page", function () {
        functionLibrary.fnLogInfo('User gets data of webtable on the page');
        functionLibrary.fnGetDataOfWebtable(examplePage.webtableBody).then(function (str) {
            functionLibrary.fnLogInfo("Data of webtable - " + str);
        })
    })
    .when("User gets Row data for particular column webtable on the page", function () {
        functionLibrary.fnLogInfo('User gets Row data for particular column webtable on the page');
        functionLibrary.fnGetListOfRowElementsForColumnFromWebtable(examplePage.webtableBody, 1).then(function (str) {
            functionLibrary.fnLogInfo("Row data for particular column - " + str);
        })
    })
    .when("User gets column data for particular row webtable on the page", function () {
        functionLibrary.fnLogInfo('User gets column data for particular row webtable on the page');
        functionLibrary.fnGetListOfColumnElementsForRowFromWebtable(examplePage.webtableBody, 1).then(function (str) {
            for (var cnum = 0; cnum < str.length; cnum++) {
                (function (index) {
                    functionLibrary.fnLogInfo(str[index]);
                })(cnum);
            }
        })
    })
    .given("User opens selenium demo page", function () {
            functionLibrary.fnLogInfo('User opens selenium demo page');
            functionLibrary.fnOpenUrl("http://cookbook.seleniumacademy.com/DragDropDemo.html");
            functionLibrary.fnWaitTillElementVisible(examplePage.dragdrop_src_element,12000);
    })
    .when("User performs drag-drop", function () {
	       functionLibrary.fnLogInfo('User performs drag-drop');
           functionLibrary.fnWaitTillElementVisible(examplePage.dragdrop_src_element,12000);
           functionLibrary.fnDragAndDrop(examplePage.dragdrop_src_element,examplePage.dragdrop_dest_element);
    })
    .then("User verify element is dragged to droppable section", function () {
		    functionLibrary.fnLogInfo('User verify dropped text is visible');
            functionLibrary.fnVerifyElementExistenceWithText(examplePage.dragdrop_dest_element_dropped,"Dropped!");
     })

//Please note this scenaio doesnt work with headless browser(PhantomJS)
    .given("User opens Google home page", function () {
            functionLibrary.fnLogInfo('User opens Google home page');
            functionLibrary.fnOpenUrl("https://www.google.co.in/");
            //functionLibrary.fnWaitTillElementVisible(examplePage.GoogLogo,12000);
    })
    .when("User download Images from UI", function () {
            functionLibrary.fnLogInfo('User download Images from UI');
            functionLibrary.fnGetElementCSSvalue(examplePage.GoogLogo, 'background-image').then(function (value) {
                functionLibrary.fnLogInfo("Value in When " + value);
                if (value.indexOf('"') >= 0) {
                    var finalURL = value.split('"')[1];
                } else {
                    finalURL = value;
                }

                functionLibrary.fnLogInfo("Value after Split " + finalURL);
                functionLibrary.fnLogInfo("Path of image2 " + image2);
                return functionLibrary.fndownload(finalURL, image2);
            });
     })
    .then("User compare both the images", function () {
	    functionLibrary.fnLogInfo('User compare both the images');
        functionLibrary.fnLogInfo('Path of image1'+image1);
        //functionLibrary.fnImageCompare(image1,image2);
     })
     
    .given("User opens Example home page and verify PageTimeout", function () {
            functionLibrary.fnLogInfo('User opens Example home page and verify PageTimeout');
            //functionLibrary.fnOpenUrl("https://www.google.co.in/");
            functionLibrary.fnPageLoadTime(url,10000);
    });
    return library;
})();
