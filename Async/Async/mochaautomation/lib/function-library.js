var webdriver = require('selenium-webdriver');
var fs = require('fs');
var pdfjsLib = require('pdfjs-dist');
var assert = require('assert');
var request = require('request');
var resemble = require("node-resemble-js");
var Excel = require('exceljs');
//var resemble = require("..\\node_modules\\node-resemble-js\\resemble.js");
//var pdfDocument;
FunctionLibrary = function FunctionLibrary(driver) {
    this.driver = driver;
};


/*
 * # Function Name: fnOpenUrl()
 *
 * # Author: Raj Mohan Singh
 *
 * # Description: This function will open the url in to browser.
 *
 * # Input Parameters: String : Url of the application
 */

FunctionLibrary.prototype.fnOpenUrl = function (url) {
    this.driver.get(url);
    return webdriver.promise.fulfilled(true);
};

/*
 * # Function Name: fnGenerateRandomAlphaNumericString()
 *
 * # Author: Sunny Jain
 *
 * # Description: This function will generate the random alphanumeric string of given size.
 *
 * # Input Parameters: String : Int - Length of the required string
 */

FunctionLibrary.prototype.fnGenerateRandomAlphaNumericString = function (len) {
    var text = "";
    var alpha = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
    var n = alpha.length;

    for (var i = 0; i < len; i++) {
        text += alpha.charAt(Math.floor(Math.random() * alpha.length));
    }
    return text;
};


/*
 * # Function Name: fnUncheckCheckbox()
 *
 * # Author: Raj Mohan Singh
 *
 * # Description: This function will unselect the checkbox.
 *
 * # Input Parameters: Webelement : Element to be unchecked.
 */

FunctionLibrary.prototype.fnUncheckCheckbox = function (element) {
    var d = webdriver.promise.defer();
    var elem = this.driver.findElement(element);
    var self = this;
    elem.isSelected().then(function (boolValue) {
        if (boolValue) {
            elem.click().then(function () {
                elem.isSelected().then(function (boolCheck) {
                    if (boolCheck) {
                        self.fnLogInfo("Fail - Element has not been unchecked.");
                        assert.equal(true, false, "Fail - Element has not been unchecked.");
                        d.fulfill(false);
                    } else {
                        self.fnLogInfo("Pass - Element has been unchecked successfully.");
                        assert.equal(true, true, "Pass - Element has been unchecked successfully.");
                        d.fulfill(false);
                    }
                }, function (e) {
                    d.fulfill(false);
                    assert.equal(true, false, "Error: " + e.message);
                    self.fnLogError("Error - " + e.message)
                });
            }, function (e) {
                d.fulfill(false);
                assert.equal(true, false, "Error - " + e.message);
                self.fnLogError("Error - " + e.message)
            });
        }
        else {
            self.fnLogInfo("Info - Element is already unchecked");
            assert.equal(true, true, "Info - Element is already unchecked.");
            d.fulfill(true);
        }
    }, function (e) {
        d.fulfill(false);
        assert.equal(true, false, "Error - " + e.message);
        self.fnLogError("Error - " + e.message)
    });
    return d.promise;
};

/*
 * # Function Name: fnCheckCheckbox()
 *
 * # Author: Raj Mohan Singh
 *
 * # Description: This function will select the checkbox.
 *
 * # Input Parameters: Webelement : Element to be checked
 */

FunctionLibrary.prototype.fnCheckCheckbox = function (element) {
    var d = webdriver.promise.defer();
    var elem = this.driver.findElement(element);
    var self = this;
    elem.isSelected().then(function (boolValue) {
        if (!boolValue) {
            elem.click().then(function () {
                elem.isSelected().then(function (boolCheck) {
                    if (boolCheck) {
                        self.fnLogInfo("Pass - Element has been checked successfully.");
                        assert.equal(true, true, "Pass - Element has been checked successfully.");
                        d.fulfill(true);
                    } else {
                        self.fnLogInfo("Fail - Element has not been checked.");
                        assert.equal(true, false, "Fail - Element has not been checked.");
                        d.fulfill(false);
                    }
                }, function (e) {
                    d.fulfill(false);
                    assert.equal(true, false, "Error - " + e.message);
                    self.fnLogError("Error - " + e.message)
                });
            }, function (e) {
                d.fulfill(false);
                assert.equal(true, false, "Error - " + e.message);
                self.fnLogError("Error - " + e.message)
            });
        }
        else {
            self.fnLogInfo("Info - Element is already checked")
            assert.equal(true, true, "Info - Element is already checked");
            d.fulfill(true);
        }
    }, function (e) {
        d.fulfill(false);
        assert.equal(true, false, "Error - " + e.message);
        self.fnLogError("Error - " + e.message);
    });
    return d.promise;
};

/*
 * # Function Name: fnSwitchToParentWindow()
 *
 * # Author: Sunny Jain
 *
 * # Description: This function will switch to the main window.
 *
 * # Input Parameters: String : Handler string of main window.
 */

FunctionLibrary.prototype.fnSwitchToParentWindow = function (parentWindow) {
    var d = webdriver.promise.defer();
    var self = this;
    this.driver.switchTo().window(parentWindow).then(function () {
        assert.equal(true, true, "Pass - successfully switched to parent window");
        d.fulfill(true);
    }, function (e) {
        d.fulfill(false);
        assert.equal(true, false, "Error - " + e.message);
        self.fnLogError("Error - " + e.message)
    });
    return d.promise;
};

/*
 * # Function Name: fnScrollPage()
 *
 * # Author: Raj MOhan Singh
 *
 * # Description: This function will scroll up /down the page by given pixels
 *
 * # Input Parameters: String : Scroll type either Up or Down ,String : pixels
 */

FunctionLibrary.prototype.fnScrollPage = function (scrollCase, pixelToScroll) {
    var d = webdriver.promise.defer();
    var self = this;
    self.fnLogInfo("In ScrollPage");
    switch (scrollCase.toUpperCase()) {
        case "DOWN":
            self.fnLogInfo("In Down")
            this.driver.executeScript("scrollBy(0," + pixelToScroll + ");");
            break;
        case "UP":
            self.fnLogInfo("In Up")
            this.driver.executeScript("scrollBy(0," + -pixelToScroll + ");");
            break;
    }
    d.fulfill(true);
    return d.promise;
};

/*
 * # Function Name: fnSelectRadioButton()
 *
 * # Author: Raj MOhan Singh
 *
 * # Description: This function will select the radiobutton.
 *
 * # Input Parameters: WebElementList : raiogroup element ,String : Value of radiobutton to be selected.
 */

FunctionLibrary.prototype.fnSelectRadioButton = function (elementList, optionVal) {
    var self = this;
    var d = webdriver.promise.defer();

    this.driver.findElements(elementList).then(function (radiosList) {

        for (var i = 0; i < radiosList.length; i++) {
            (function (index) {
                radiosList[index].getAttribute("value").then(function (val) {

                    if (val == optionVal) {
                        radiosList[index].click();
                        self.fnLogInfo("Pass - succefully selected the radio button");
                        assert.equal(true, true, "Pass - Succefully selected the radio button.");
                        d.fulfill(true);
                    }
                }, function (e) {
                    d.fulfill(false);
                    assert.equal(true, false, "Error - " + e.message);
                    self.fnLogError("Error - " + e.message)
                });
            })(i);

        }
    }, function (e) {
        d.fulfill(false);
        assert.equal(true, false, "Error - " + e.message);
        self.fnLogError("Error - " + e.message)
    });

    return d.promise;
};


/*
 * # Function Name: fnVerifyDateFormatOfMMDDYYYY()
 *
 * # Author: Raj Mohan Singh
 *
 * # Description: This function will verify the whether given date is in MM/DD/YYYY format or not.
 *
 * # Input Parameters: WebElement : date element
 */

FunctionLibrary.prototype.fnVerifyDateFormatOfMMDDYYYY = function (element) {
    var self = this;
    var d = webdriver.promise.defer();
    this.driver.findElement(element).getText().then(function (text) {
        var regex = /^(0[1-9]|1[0-2])\/(0[1-9]|[1-2][0-9]|3[0-1])\/([0-9][0-9][0-9][0-9])$/;

        if (regex.test(text)) {
            d.fulfill(true);
            assert.equal(true, true, "Pass - Date format - MMDDYY has been verified successfully.");
            self.fnLogInfo("Pass - Date format - MMDDYY has been verified successfully");
        } else {
            d.fulfill(false);
            assert.equal(true, false, "Fail - Date format - MMDDYY has not been verified.");
            self.fnLogError("Fail - Date format - MMDDYY has not been verified.");
        }
    }, function (e) {
        d.fulfill(false);
        assert.equal(true, false, "Error - " + e.message);
        self.fnLogError("Error - " + e.message);
    });
    return d.promise;
};

/*
 * # Function Name: fnVerifyDropdownOptions()
 *
 * # Author: Sunny Jain
 *
 * # Description: This function will verify all the options present in a dropdown.
 *
 * # Input Parameters: WebElement : element, value to be selected
 */

FunctionLibrary.prototype.fnVerifyDropdownOptions = function (element, str) {
    var self = this;
    var d = webdriver.promise.defer();
    var expectedText = str.split("@");
    this.driver.findElement(element).then(function (mySelect) {
        mySelect.findElements(webdriver.By.tagName("option")).then(function (option) {

            var NoOfValues_exptd = expectedText.length;
            var NoOfValues_actual = option.length;

            if (option.length === 0) {
                self.fnLogInfo("No Option exists");
                assert.equal(true, false, "Fail - No Option exists");
                d.fulfill(false);
            }

            if (NoOfValues_exptd != NoOfValues_actual) {
                d.fulfill(false);
                assert.equal(true, false, "Fail - Mis match in Actual and Expected number of values");
                self.fnLogInfo("Fail - Mis match in Actual and Expected number of values");

            } else {
                for (var j = 0; j < option.length; j++) {
                    (function (index) {
                        option[index].getText().then(function (val) {
                            if (val === expectedText[index]) {
                                d.fulfill(true);
                                assert.equal(true, true, "Pass - " + expectedText[index] + " option exists in the Dropdown.");
                                self.fnLogInfo("Pass - " + expectedText[index] + " option exists in the Dropdown");

                            } else {
                                d.fulfill(false);
                                assert.equal(true, false, "Fail - " + expectedText[index] + " option doesnot exist in the Dropdown.");
                                self.fnLogError("Fail - " + expectedText[index] + " option doesnot exist in the Dropdown");
                            }
                        }, function (e) {
                            d.fulfill(false);
                            assert.equal(true, false, "Error - " + e.message);
                            self.fnLogError("Error - " + e.message);
                        });
                    })(j);
                }
            }
        }, function (e) {
            d.fulfill(false);
            assert.equal(true, false, "Error - " + e.message);
            self.fnLogError("Error - " + e.message);
        }), function (e) {
            d.fulfill(false);
            assert.equal(true, false, "Error - " + e.message);
            self.fnLogError("Error - " + e.message);
        }
    }, function (e) {
        d.fulfill(false);
        assert.equal(true, false, "Error: " + e.message);
        self.fnLogError("Error - " + e.message);
    });
    return d.promise;
};

/*
 * # Function Name: fnGetDataOfWebtable()
 *
 * # Author: Sunny Jain
 *
 * # Description: This function will retrive all the data of the webtable.
 *
 * # Input Parameters: WebElement : webtable element
 */


FunctionLibrary.prototype.fnGetDataOfWebtable = function (element) {
    var values = [];
    var d = webdriver.promise.defer();
    var self = this;
    this.driver.findElement(element).then(function (ele) {

        ele.findElements(webdriver.By.tagName("tr")).then(function (rows) {
            for (var rnum = 0; rnum < rows.length; rnum++) {
                (function (index) {
                    rows[index].findElements(webdriver.By.tagName("td")).then(function (columns) {
                        for (var cnum = 0; cnum < columns.length; cnum++) {
                            (function (loop) {
                                columns[loop].getText().then(function (val) {
                                    values.push(val);
                                })
                            })(cnum);
                        }
                        d.fulfill(true);
                    }, function (e) {
                        d.fulfill(false);
                        assert.equal(true, false, "Error - " + e.message);
                        self.fnLogError("Error - " + e.message)
                    });
                })(rnum);
            }
            d.fulfill(values);
        }, function (e) {
            d.fulfill(false);
            assert.equal(true, false, "Error - " + e.message);
            self.fnLogError("Error - " + e.message)
        });
    }, function (e) {
        d.fulfill(false);
        assert.equal(true, false, "Error - " + e.message);
        self.fnLogError("Error - " + e.message)
    });
    return d.promise;
};

/*
 * # Function Name: fnGetListOfRowElementsForColumnFromWebtable()
 *
 * # Author: Sunny Jain
 *
 * # Description: This function will retrieve the elements from all rows in a particular column.
 *
 * # Input Parameters: WebElement : webtable element,Int : Column Index
 */

FunctionLibrary.prototype.fnGetListOfRowElementsForColumnFromWebtable = function (element, colIndex) {
    var values = [];
    var d = webdriver.promise.defer();
    var self = this;
    this.driver.findElement(element).then(function (ele) {

        ele.findElements(webdriver.By.tagName("tr")).then(function (rows) {
            for (var rnum = 0; rnum < rows.length; rnum++) {
                (function (index) {
                    rows[index].findElements(webdriver.By.tagName("td")).then(function (columns) {

                        columns[colIndex - 1].getText().then(function (val) {
                            values.push(val);
                        })
                    })
                })(rnum);
            }
            d.fulfill(values);
        }, function (e) {
            d.fulfill(false);
            assert.equal(true, false, "Error - " + e.message);
            self.fnLogError("Error - " + e.message)
        });;
    }, function (e) {
        d.fulfill(false);
        assert.equal(true, false, "Error - " + e.message);
        self.fnLogError("Error - " + e.message)
    });
    return d.promise;
};

/*
 * # Function Name: fnGetListOfColumnElementsForRowFromWebtable()
 *
 * # Author: Sunny Jain
 *
 * # Description: This function will retrieve the elements from all columns in a particular row.
 *
 * # Input Parameters: WebElement : webtable element,Int : Row Index
 */

FunctionLibrary.prototype.fnGetListOfColumnElementsForRowFromWebtable = function (element, rowIndex) {
    var values = [];
    var d = webdriver.promise.defer();
    var self = this;
    this.driver.findElement(element).then(function (ele) {

        ele.findElements(webdriver.By.tagName("tr")).then(function (rows) {

            rows[rowIndex - 1].findElements(webdriver.By.tagName("td")).then(function (columns) {

                for (var cnum = 0; cnum < columns.length; cnum++) {
                    (function (index) {

                        columns[index].getText().then(function (val) {
                            values.push(val);
                        })
                    })(cnum);
                }
                d.fulfill(values);
            }, function (e) {
                d.fulfill(false);
                assert.equal(true, false, "Error - " + e.message);
                self.fnLogError("Error - " + e.message)
            });;
        }, function (e) {
            d.fulfill(false);
            assert.equal(true, false, "Error - " + e.message);
            self.fnLogError("Error - " + e.message)
        });
    }, function (e) {
        d.fulfill(false);
        assert.equal(true, false, "Error - " + e.message);
        self.fnLogError("Error - " + e.message)
    });
    return d.promise;
};

/*
 * # Function Name: fnGetElementText()
 *
 * # Author: Sunny Jain
 *
 * # Description: This function will retrieve the text of the element.
 *
 * # Input Parameters: WebElement : element
 */

FunctionLibrary.prototype.fnGetElementText = function (element) {
    var self = this;
    var d = webdriver.promise.defer();
    this.driver.findElement(element).getText().then(function (text) {
        self.fnLogInfo("Pass - Get the text : " + text + "Successfully");
        assert.equal(true, true, "Pass - Get the text : " + text + "Successfully");
        d.fulfill(text);
    }, function (e) {
        d.fulfill(false);
        assert.equal(true, false, "Error - " + e.message);
        self.fnLogError("Error - " + e.message)
    });
    return d.promise;
};


/*
 * # Function Name: fnSelectValueFromDropDown()
 *
 * # Author: Sunny Jain
 *
 * # Description: This function will select the value from the dropdown.
 *
 * # Input Parameters: WebElement : element ,String: option value or text to be selected
 */

FunctionLibrary.prototype.fnSelectValueFromDropDown = function (element, text) {
    var self = this;
    var d = webdriver.promise.defer();
    var tempdriver = this.driver;
    this.driver.findElement(element).then(function (mySelect) {
        mySelect.sendKeys(text).then(function () {
            tempdriver.findElement(element).getText().then(function (restext) {
                if (restext.includes(text)) {
                    self.fnLogInfo("Pass - Sucessfully selected the value-" + text + " from dropdown.");
                    assert.equal(true, true, "Pass - Sucessfully selected the value-" + text + " from dropdown.");
                    d.fulfill(true);
                }
                else {
                    self.fnLogInfo("Fail - Not able to select the value " + text + " from dropdown.Please check");
                    assert.equal(true, false, "Fail - Not able to select the value " + text + " from dropdown.Please check");
                    d.fulfill(false);
                }
            }, function (e) {
                d.fulfill(false);
                assert.equal(true, false, "Error - " + e.message);
                self.fnLogError("Error - " + e.message)
            });

        }, function (e) {
            d.fulfill(false);
            assert.equal(true, false, "Error - " + e.message);
            self.fnLogError("Error - " + e.message);
        });
    }, function (e) {
        d.fulfill(false);
        assert.equal(true, false, "Error - " + e.message);
        self.fnLogError("Error - " + e.message);
    });
    return d.promise;
};


/*
 * # Function Name: fnVerifyElementExistenceWithText()
 *
 * # Author: Sunny Jain
 *
 * # Description: This function will verify the element existence with its text.
 *
 * # Input Parameters: WebElement : element ,String: element text
 */

FunctionLibrary.prototype.fnVerifyElementExistenceWithText = function (element, strText) {
    var d = webdriver.promise.defer();
    var self = this;
    this.driver.findElement(element).getText().then(function (text) {
        if (text === strText) {
            self.fnLogInfo("Pass - Element with text-" + strText + " has been verified successfully.");
            assert.equal(true, true, "Pass - Element with text-" + strText + " has been verified successfully.");
            d.fulfill(true);
        }
        else {
            self.fnLogInfo("Fail - Element with text-" + strText + " has not been verified.");
            assert.equal(true, false, "Fail - Element with text-" + strText + " has not been verified.");
            d.fulfill(false);
        }
    }, function (e) {
        d.fulfill(false);
        assert.equal(true, false, "Error - " + e.message);
        self.fnLogError("Error - " + e.message)
    });
    return d.promise;
};


/*
 * # Function Name: fnVerifyElementExistenceWithPartialText()
 *
 * # Author: Raj Mohan Singh
 *
 * # Description: This function will verify the element existence with its partial text.
 *
 * # Input Parameters: WebElement : element ,String: element partial text
 */

FunctionLibrary.prototype.fnVerifyElementExistenceWithPartialText = function (element, strText) {
    var d = webdriver.promise.defer();
    var self = this;
    this.driver.findElement(element).getText().then(function (text) {
        if (text.includes(strText)) {
            self.fnLogInfo("Pass - Element with text-" + strText + " has been verified successfully.");
            assert.equal(true, true, "Pass - Element with text-" + strText + " has been verified successfully.");
            d.fulfill(true);
        }
        else {
            self.fnLogError("Fail - Element with text-" + strText + " has not been verified.");
            assert.equal(true, false, "Fail - Element with text-" + strText + " has not been verified.");
            d.fulfill(false);
        }
    }, function (e) {
        d.fulfill(false);
        assert.equal(true, false, "Error - " + e.message);
        self.fnLogError("Error - " + e.message)
    });
    return d.promise;
};


/*
 * # Function Name: fnVerifyElementExistence()
 *
 * # Author: Sunny Jain
 *
 * # Description: This function will verify the element existence.
 *
 * # Input Parameters: WebElement : element ,String: element text
 */

FunctionLibrary.prototype.fnVerifyElementExistence = function (element, desc) {
    var self = this;
    var d = webdriver.promise.defer();
    this.driver.findElement(element).isDisplayed().then(function (status) {
        if (status) {
            self.fnLogInfo("Pass - " + desc + "-exists on the page");
            assert.equal(true, true, "Pass - " + desc + "-exists on the page.");
            d.fulfill(true);

        } else {
            self.fnLogError("Fail - " + desc + "- does not exist on the page");
            assert.equal(true, false, "Fail - " + desc + "- does not exist on the page.");
            d.fulfill(false);
        }
    }, function (e) {
        d.fulfill(false);
        assert.equal(true, false, "Error - " + e.message);
        self.fnLogError("Error - " + e.message)
    });
    return d.promise;
};

/*
 * # Function Name: fnVerifyStateOfWebelement()
 *
 * # Author: Sunny Jain
 *
 * # Description: This function will verify the state of the element .
 *
 * # Input Parameters: WebElement : element ,String: state of element to be verified.
 */


FunctionLibrary.prototype.fnVerifyStateOfWebelement = function (element, state) {
    var self = this;
    var d = webdriver.promise.defer();
    if (state === "Enable") {
        this.driver.findElement(element).getAttribute("class").then(function (status) {

            if (status.includes("disabled")) {
                self.fnLogError("Fail - Element is not enabled.");
                assert.equal(true, false, "Fail - Element is not enabled.");
                d.fulfill(false);
            } else {
                self.fnLogInfo("Pass - Element is enabled");
                assert.equal(true, true, "Pass - Element is enabled.");
                d.fulfill(true);
            }
        }, function (e) {
            d.fulfill(false);
            assert.equal(true, false, "Error - " + e.message);
            self.fnLogError("Error - " + e.message)
        });
    }
    else if (state === "Disable") {
        this.driver.findElement(element).getAttribute("class").then(function (status) {

            if (status.includes("disabled")) {

                self.fnLogInfo("Pass - Element is disabled.");
                assert.equal(true, true, "Pass - Element is disabled.");
                d.fulfill(true);
            } else {
                self.fnLogError("Fail - Element is not disabled");
                assert.equal(true, false, "Fail - Element is not disabled");
                d.fulfill(false);
            }
        }, function (e) {
            d.fulfill(false);
            assert.equal(true, false, "Error - " + e.message);
            self.fnLogError("Error - " + e.message)
        });
    }
    return d.promise;
};

/*
 * # Function Name: fnClick()
 *
 * # Author: Raj Mohan Singh
 *
 * # Description: This function will click on the element .
 *
 * # Input Parameters: WebElement : element .
 */

FunctionLibrary.prototype.fnClick = function (element) {
    var self = this;
    var d = webdriver.promise.defer();
    this.driver.findElement(element).click().then(function () {
        self.fnLogInfo("Pass - Element has been clicked successfully.")
        assert.equal(true, true, "Pass - Element has been clicked successfully.");
        d.fulfill(true);
    }, function (e) {
        d.fulfill(false);
        assert.equal(true, false, "Error - " + e.message);
        self.fnLogError("Error - " + e.message)
    });
    return d.promise;
};


/*
 * # Function Name: fnSwitchToNewlyOpenedWindow()
 *
 * # Author: Raj Mohan Singh
 *
 * # Description: This function will switch to the newly opened window.
 *
 * # Input Parameters: NA
 */

FunctionLibrary.prototype.fnSwitchToNewlyOpenedWindow = function () {
    var d = webdriver.promise.defer();
    var driver = this.driver;
    var self = this;
    driver.getAllWindowHandles().then(function (handles) {
        for (var i = 0; i < handles.length; i++) {
            driver.switchTo().window(handles[i]);
        }
        d.fulfill(true);
    }, function (e) {
        d.fulfill(false);
        assert.equal(true, false, "Error - " + e.message);
        self.fnLogError("Error - " + e.message)
    });
    return d.promise;
};

/*
 * # Function Name: fnSwitchToTopFrame()
 *
 * # Author: Sunny Jain
 *
 * # Description: This function will switch back to the top frame.
 *
 * # Input Parameters: NA
 */

FunctionLibrary.prototype.fnSwitchToTopFrame = function () {
    var self = this;
    var d = webdriver.promise.defer();
    this.driver.switchTo().defaultContent().then(function () {
        assert.equal(true, true, "Pass - Switch to top frame.");
        self.fnLogInfo("Pass - Switch to top frame.");
        d.fulfill(true);
    }, function (e) {
        d.fulfill(false);
        assert.equal(true, false, "Error - " + e.message);
        self.fnLogError("Error - " + e.message);
    });
    return d.promise;
};

/*
 * # Function Name: fnSwitchToFrame()
 *
 * # Author: Sunny Jain
 *
 * # Description: This function will switch to the given frame.
 *
 * # Input Parameters: Webelement : Frame element
 */

FunctionLibrary.prototype.fnSwitchToFrame = function (frame) {
    var self = this;
    var d = webdriver.promise.defer();
    var tempdriver = this.driver;
    this.driver.findElement(frame).then(function (myframe) {
        self.fnLogError("in my frame element: " + myframe);
        tempdriver.switchTo().frame(myframe).then(function () {
            assert.equal(true, true, "Pass - Switch to top frame.");
            d.fulfill(true);
        }, function (e) {
            d.fulfill(false);
            assert.equal(true, false, "Error - " + e.message);
            self.fnLogError("Error - " + e.message);
        });
    }, function (e) {
        d.fulfill(false);
        assert.equal(true, false, "Error - " + e.message);
        self.fnLogError("Error - " + e.message);
    });

    return d.promise;
};

/*
 * # Function Name: fnGetHeadersOfWebtable()
 *
 * # Author: Sunny Jain
 *
 * # Description: This function will retrieve the headers of the webtable.
 *
 * # Input Parameters: WebElement : element , Int: Row index
 */

FunctionLibrary.prototype.fnGetHeadersOfWebtable = function (element, rowIndex) {
    var self = this;
    var colValues = [];
    var d = webdriver.promise.defer();

    this.driver.findElement(element).then(function (ele) {
        ele.findElements(webdriver.By.tagName("tr")).then(function (rows) {

            rows[rowIndex - 1].findElements(webdriver.By.tagName("th")).then(function (column) {
                for (var cnum = 0; cnum < column.length; cnum++) {

                    (function (index) {
                        column[index].getText().then(function (val) {
                            //colValues[index] = val;
                            colValues.push(val);
                        });
                    })(cnum);
                }

                d.fulfill(colValues);
            }, function (e) {
                d.fulfill(false);
                assert.equal(true, false, "Error - " + e.message);
                self.fnLogError("Error - " + e.message);
            });
        }, function (e) {
            d.fulfill(false);
            assert.equal(true, false, "Error - " + e.message);
            self.fnLogError("Error - " + e.message);
        });

    });

    return d.promise;
};


/*
 * # Function Name: fnVerifyDataOfWebtable()
 *
 * # Author: Sunny Jain
 *
 * # Description: This function will verify the data of the webtable..
 *
 * # Input Parameters: WebElement : WebTable , String : expected data of the table separated by @.
 */


FunctionLibrary.prototype.fnVerifyDataOfWebtable = function (element, str) {
    var self = this;
    var d = webdriver.promise.defer();
    this.fnGetDataOfWebtable(element).then(function (actualText) {
        var expectedText = str.split("@");
        for (var j = 0; j < actualText.length; j++) {
            if (actualText[j] === expectedText[j]) {
                d.fulfill(true);
                assert.equal(true, true, "Pass - " + expectedText[j] + " has been verified successfully.");
                self.fnLogInfo("Pass - " + expectedText[j] + " has been verified successfully");
            } else {
                d.fulfill(false);
                assert.equal(true, false, "Fail - " + expectedText[j] + " has not been verified.");
                self.fnLogError("Fail - " + expectedText[j] + " has not been verified");
            }
        }
    }, function (e) {
        d.fulfill(false);
        assert.equal(true, false, "Error - " + e.message);
        self.fnLogError("Error - " + e.message);
    });
    return d.promise;
};


/*
 * # Function Name: fnVerifyElementColor()
 *
 * # Author: Sunny Jain
 *
 * # Description: This function will verify the color of the element.
 *
 * # Input Parameters: WebElement : element , String : expected RGB value of the color.
 */

FunctionLibrary.prototype.fnVerifyElementColor = function (element, colorCode) {
    var self = this;
    var d = webdriver.promise.defer();
    this.driver.findElement(element).getCssValue("color").then(function (rgb) {
        if (rgb === colorCode) {
            d.fulfill(true);
            assert.equal(true, true, "Pass - Actual color is same as expected color.");
            self.fnLogInfo("Pass - Actual color is same as expected color");
        } else {
            d.fulfill(false);
            assert.equal(true, false, "Fail - Actual color is not same as expected color.");
            self.fnLogError("Fail - Actual color is not same as expected color");
        }
    }, function (e) {
        d.fulfill(false);
        assert.equal(true, false, "Error - " + e.message);
        self.fnLogError("Error - " + e.message);
    });
    return d.promise;
};

/*
 * # Function Name: fnMouseOver()
 *
 * # Author: Raj Mohan Singh
 *
 * # Description: This function will perform the mouse over operation on the element.
 *
 * # Input Parameters: WebElement : element
 */

FunctionLibrary.prototype.fnMouseOver = function (element) {
    var self = this;
    var d = webdriver.promise.defer();
    self.fnLogInfo("In mouseover");
    new webdriver.ActionSequence(this.driver).
        mouseMove(this.driver.findElement(element)).
        perform();
    d.fulfill(true);
    return d.promise;
};

/*
 * # Function Name: fnDragAndDrop()
 *
 * # Author: Raj Mohan Singh
 *
 * # Description: This function willperfornm the drag & drop operation on the application.
 *
 * # Input Parameters: WebElement : source element , WebElement :  destimation element
 */


FunctionLibrary.prototype.fnDragAndDrop = function (srcElement, destElement) {
    var self = this;
    var d = webdriver.promise.defer();
    self.fnLogInfo("In DragAndDropMouseOver");
    new webdriver.ActionSequence(this.driver).
        dragAndDrop(this.driver.findElement(srcElement), this.driver.findElement(destElement)).
        perform();
    d.fulfill(true);
    return d.promise;
};

/*
 * # Function Name: fnWaitTillElementVisible()
 *
 * # Author: Raj Mohan Singh
 *
 * # Description: This function will wait till the element gets visible.
 *
 * # Input Parameters: WebElement : element ,int : Time (Miliiseconds)
 */


FunctionLibrary.prototype.fnWaitTillElementVisible = function (element, iTimeOut) {
    var self = this;
    var d = webdriver.promise.defer();
    var until = webdriver.until;
    var timeout = iTimeOut || mochaTimeoutMS;
    this.driver.wait(until.elementIsVisible(this.driver.findElement(element)), timeout).then(function () {
        self.fnLogInfo("Pass - element found on screen");
        assert.equal(true, true, "Pass - element found on screen.");
        d.fulfill(true);
    }, function (e) {
        d.fulfill(false);
        assert.equal(true, false, "Error - " + e.message);
        self.fnLogError("Error -  " + e.message);
    });
    return d.promise;
};

/*
 * # Function Name: fnSendKeys()
 *
 * # Author: Sunny Jain
 *
 * # Description: This function will enter the value in the textbox.
 *
 * # Input Parameters: WebElement : element ,String : value to be entered.
 */

FunctionLibrary.prototype.fnSendKeys = function (element, text) {
    var self = this;
    var d = webdriver.promise.defer();
    this.driver.findElement(element).sendKeys(text).then(function () {
        self.fnLogInfo("Pass - " + text + " has been entered successfully in the element.")
        assert.equal(true, true, "Pass - " + text + " has been entered successfully in the element.");
        d.fulfill(true);
    }, function (e) {
        d.fulfill(false);
        assert.equal(true, false, "Error - " + e.message);
        self.fnLogError("Error - " + e.message)
    });
    return d.promise;
};

/*
 * # Function Name: fnVerificationOfElementAttributeValue()
 *
 * # Author: Raj Mohan Singh
 *
 * # Description: This function will verify the value of the given attribute of the element.
 *
 * # Input Parameters: WebElement : element ,String : attribute name ,String: attribute value.
 */

FunctionLibrary.prototype.fnVerificationOfElementAttributeValue = function (element, attribute, strText) {
    var self = this;
    var d = webdriver.promise.defer();
    this.driver.findElement(element).getAttribute(attribute).then(function (text) {
        if (text === strText) {
            self.fnLogInfo("Pass - Value of Element's attribute " + attribute + " has been verified successfully.");
            assert.equal(true, true, "Pass - Value of Element's attribute " + attribute + " has been verified successfully.");
            d.fulfill(true);
        }
        else {
            self.fnLogError("Fail - Element with attribute " + attribute + "- value has not been verified. Value of attribute is:  " + text);
            assert.equal(true, false, "Fail - Element with attribute " + attribute + "- value has not been verified.Value of attribute is:  " + text);
            d.fulfill(false);
        }
    }, function (e) {
        d.fulfill(false);
        assert.equal(true, false, "Error - " + e.message);
        self.fnLogError("Error - " + e.message)
    });
    return d.promise;
};

/*
 * # Function Name: fnGoBack()
 *
 * # Author: Raj Mohan Singh
 *
 * # Description: This function will perform the back opertaion on webpage.
 *
 * # Input Parameters: NA
 */

FunctionLibrary.prototype.fnGoBack = function () {

    return this.driver.navigate().back();
}



/*
 * # Function Name: fnVerifyHeadersOfwebtable()
 *
 * # Author: Raj Mohan Singh
 *
 * # Description: This function will verify the headers of the webtable.
 *
 * # Input Parameters: WebElement : Webtable element ,Int : Row Index ,String: Headers(Expected) of webtable separated by@.
 */

FunctionLibrary.prototype.fnVerifyHeadersOfwebtable = function (element, rowIndex, str) {
    var self = this;
    var d = webdriver.promise.defer();
    this.fnGetHeadersOfWebtable(element, rowIndex).then(function (actualText) {
        var expectedText = str.split("@");
        var NoOfcols_exptd = expectedText.length;
        var NoOfcols_actul = actualText.length;

        if (NoOfcols_exptd != NoOfcols_actul) {
            d.fulfill(false);
            assert.equal(true, false, "Fail - Mis-match in Actual and Expected number of columns ." + "\nExpected:" + expectedText + "\nActual:" + actualText);
            self.fnLogInfo("Fail - There is a Mis-match in Actual and Expected number of columns .");

        } else {
            for (j = 0; j < actualText.length; j++) {
                if (actualText[j] === expectedText[j]) {
                    d.fulfill(true);
                    assert.equal(true, true, "Pass - " + expectedText[j] + " column is present in the table");
                    self.fnLogInfo("Pass - " + actualText[j] + " column is present in the table");
                } else {
                    d.fulfill(false);
                    assert.equal(true, false, "Fail - " + expectedText[j] + " column is not present in the table");
                    self.fnLogError("Fail - " + actualText[j] + " column is not present in the table");
                }
            }
        }
    }, function (e) {
        d.fulfill(false);
        assert.equal(true, false, "Error - " + e.message);
        self.fnLogInfo("Error - " + e.message);
    });
    return d.promise;
};

/*
 * # Function Name: fnTextcontainVerification()
 *
 * # Author: Raj Mohan Singh
 *
 * # Description: This function will verify whether a particular text/string is present in a sentence/group of sentence.
 *
 * # Input Parameters: String : Sentence/text in which you want to search another string/text ,String: Text/string you want to search in a sentence.
 */
FunctionLibrary.prototype.fnTextcontainVerification = function (completeText, searchText) {
    var d = webdriver.promise.defer();
    var self = this;
    if (completeText.indexOf(searchText) >= 0) {
        self.fnLogInfo("Pass - Text found in Page");
        assert.equal(true, true, "Pass - Text found in Page.");
        d.fulfill(true);

    } else {
        d.fulfill(false);
        assert.equal(true, false, "Fail - Text nOt found in Page.");
        self.fnLogError("Fail - Text nOt found in Page");
    }

    return d.promise;
};


/*
 * # Function Name: fnPageLoadTime()
 *
 * # Author: Raj Mohan Singh
 *
 * # Description: This function will verify that whether a page loads under certain time or not.
 *
 * # Input Parameters: String : Url of the application,Int : Amount of time in millisecond
 */
FunctionLibrary.prototype.fnPageLoadTime = function (url,vTimeout) {
    var d = webdriver.promise.defer();
    var self = this;
    this.driver.manage().timeouts().pageLoadTimeout(vTimeout); 
    this.driver.get(url).then(function success() {
       self.fnLogInfo('Page load Successfully in given time: '+vTimeout);
    }, function error(err) {
        self.fnLogError("Error - " + err);
        assert.equal(true, false, "Error: " + err);
        d.fulfill(false);
    }).thenCatch(function (e) {
        self.fnLogError("Not able to load in given time.  Error :  "+ e);
        assert.equal(true, false, "Not able to load in given time. Error :  " + e);
        d.fulfill(false);
    });
    return d.promise;
};



//------------------------------Text FIle Operations--------------------------------------------------

/*
 * # Function Name: fnVerifyFileExist()
 *
 * # Author: Raj Mohan Singh
 *
 * # Description: This function will Check if File or Directory Exists.
 *
 * # Input Parameters: String : path of the text file.
 */

FunctionLibrary.prototype.fnVerifyFileExist = function (path) {
    var self = this;
    var d = webdriver.promise.defer();
    fs.exists(path, function (exists) {
        if (exists) {
            d.fulfill(true);
            self.fnLogInfo('Pass : File found.');
        } else {
            d.fulfill(false);
            self.fnLogInfo('Fail - File Not Found');
        }
    }, function (e) {
        d.fulfill(false);
        self.fnLogInfo("Fail - " + e.message);
    });
    return d.promise;
};

/*
 * # Function Name: fnReadFile()
 *
 * # Author: Raj Mohan Singh
 *
 * # Description: This function will read the file content.
 *
 * # Input Parameters: String : path of the text file, String: the encoding of the data. Possible encodings are 'ascii', 'utf8', and 'base64'. If no encoding provided, then 'utf8' is assumed.
 */

FunctionLibrary.prototype.fnReadFile = function (path, encoding) {
    var self = this;
    var d = webdriver.promise.defer();
    fs.exists(path, function (exists) {
        if (exists) {
            if (encoding === "" || encoding === null) {
                encoding = 'utf8';
            }
            var fileData = fs.readFileSync(path, encoding);
            self.fnLogInfo('File data:' + fileData);
            d.fulfill(fileData);
        }
        else {
            self.fnLogInfo('Fail - File not found.');
            d.fulfill(false);
        }
    }, function (e) {
        d.fulfill(false);
        self.fnLogInfo("Erorr - " + e.message);
    });
    return d.promise;
};


/*
 * # Function Name: fnWriteFile()
 *
 * # Author: Raj Mohan Singh
 *
 * # Description: This function will write data into given text file and overwrite the previous data .
 *
 * # Input Parameters: String : path of the text file, String: data to be wrriten into text file, String: the encoding of the data. Possible encodings are 'ascii', 'utf8', and 'base64'. If no encoding provided, then 'utf8' is assumed.
 */
FunctionLibrary.prototype.fnWriteFile = function (path, Text, encoding) {
    var self = this;
    var d = webdriver.promise.defer();
    var buffer = new Buffer(Text);
    fs.exists(path, function (exists) {
        if (!exists) {
            fs.open(path, 'w+', function (err, fd) {
                if (err) {
                    d.fulfill(false);
                    self.fnLogError('Could not ooen file: ' + err);
                }
                // write the contents of the buffer, from position 0 to the end, to the file descriptor returned in opening our file
                fs.write(fd, buffer, 0, buffer.length, null, function (err) {
                    if (err) {
                        d.fulfill(false);
                        self.fnLogError('error writing file: ' + err);
                    }
                    fs.close(fd, function () {
                        self.fnLogInfo('wrote the file successfully');
                        d.fulfill(true);
                    }, function (e) {
                        d.fulfill(false);
                        self.fnLogInfo("Fail - " + e.message);
                    });
                });

            });

        } else {
            self.fnLogInfo('In Else Part: ');
            console.error('test.txt already exists.');
            if (encoding === "" || encoding === null) {
                encoding = 'utf8';
            }
            fs.writeFileSync(path, Text, { "encoding": encoding });
            self.fnLogInfo('Pass - Write data Successfully!!!:');
            d.fulfill(true);
        }
    }, function (e) {
        d.fulfill(false);
        self.fnLogInfo("Fail - " + e.message);
    });

    return d.promise;
};

/*
 * # Function Name: fnAppendFile()
 *
 * # Author: Raj Mohan Singh
 *
 * # Description: This function will append data into given text file .
 *
 * # Input Parameters: String : path of the text file, String: data to be appended into text file, String: the encoding of the data. Possible encodings are 'ascii', 'utf8', and 'base64'. If no encoding provided, then 'utf8' is assumed.
 */
FunctionLibrary.prototype.fnAppendFile = function (path, Text, encoding) {
    var self = this;
    var d = webdriver.promise.defer();
    fs.exists(path, function (exists) {
        if (exists) {
            fs.appendFileSync(path, Text, { "encoding": encoding });
            self.fnLogInfo('Pass - data appended successfully!!!:');
            d.fulfill(true);
        }
        else {
            self.fnLogInfo('Fail - File not found.');
            d.fulfill(false);
        }
    }, function (e) {
        d.fulfill(false);
        self.fnLogInfo("Fail - " + e.message);
    });

    return d.promise;
};


/*
 * # Function Name: fnRenameFile()
 *
 * # Author: Raj Mohan Singh
 *
 * # Description: This function will rename the given text file .
 *
 * # Input Parameters: String : name of the text file (include absolute/relative file path ), String: new Name of the text file (include absolute/relative file path ).
 */
FunctionLibrary.prototype.fnRenameFile = function (name, newName) {
    var self = this;
    var d = webdriver.promise.defer();
    fs.exists(path, function (exists) {
        if (exists) {
            fs.rename(name, newName, function (err) {
                if (err) {
                    self.fnLogError(err.message);
                    d.fulfill(false);
                }
                else {
                    self.fnLogInfo('Pass - Rename complete.');
                    d.fulfill(true);
                }
            });
        }
        else {
            self.fnLogInfo('Fail - File not found.');
            d.fulfill(false);
        }
    }, function (e) {
        d.fulfill(false);
        self.fnLogInfo("Fail - " + e.message);
    });

    return d.promise;
};


/*
 * # Function Name: fnMoveFile()
 *
 * # Author: Raj Mohan Singh
 *
 * # Description: This function will move the given text file .
 *
 * # Input Parameters: String : Path of the text file, String: new location/path of the text file.
 */
FunctionLibrary.prototype.fnMoveFile = function (path, newPath) {
    var self = this;
    var d = webdriver.promise.defer();
    fs.exists(path, function (exists) {
        if (exists) {
            fs.rename(path, newPath, function (err) {
                if (err) {
                    self.fnLogError("Fail - " + err.message);
                    d.fulfill(false);
                }
                else {
                    self.fnLogInfo('Pass - Move complete.');
                    d.fulfill(true);
                }
            });
        }
        else {
            self.fnLogInfo('Fail - File not found.');
            d.fulfill(false);
        }
    }, function (e) {
        d.fulfill(false);
        self.fnLogInfo("Fail - " + e.message);
    });
    return d.promise;
};


/*
 * # Function Name: fnDeleteFile()
 *
 * # Author: Raj Mohan Singh
 *
 * # Description: This function will delete the given text file .
 *
 * # Input Parameters: String : Path of the text file.
 */
FunctionLibrary.prototype.fnDeleteFile = function (path) {
    var self = this;
    var d = webdriver.promise.defer();
    fs.exists(path, function (exists) {
        if (exists) {
            fs.unlink(path, function (err) {
                if (err) {
                    self.fnLogError("Fail - " + err.message);
                    d.fulfill(false);
                }
                else {
                    self.fnLogInfo('Pass - Deletion sucessful.');
                    d.fulfill(true);
                }
            });
        }
        else {
            self.fnLogInfo('Fail - File not found.');
            d.fulfill(false);
        }
    }, function (e) {
        d.fulfill(false);
        self.fnLogInfo("Error - " + e.message);
    });
    return d.promise;
};


/*
 * # Function Name: fnStatsFile()
 *
 * # Author: Raj Mohan Singh
 *
 * # Description: This function will give the statistics of given text file .Statistics include file size, inode, uid, gid, timestamps.
 *
 * # Input Parameters: String : Path of the text file.
 */
FunctionLibrary.prototype.fnStatsFile = function (path) {
    var self = this;
    var d = webdriver.promise.defer();
    fs.exists(path, function (exists) {
        if (exists) {
            fs.stat(path, function (err, stats) {
                if (err) {
                    self.fnLogError("Error - " + err.message);
                    d.fulfill(false);
                }
                else {
                    self.fnLogInfo('stats: ' + JSON.stringify(stats));
                    d.fulfill(true);
                }
            });
        }
        else {
            self.fnLogInfo('Fail - File not found.');
            d.fulfill(false);
        }
    }, function (e) {
        d.fulfill(false);
        self.fnLogInfo("Error - " + e.message);
    });

    return d.promise;
};

//------------------------------PDF Operations--------------------------------------------------

/*
 * # Function Name: fnPdfGetInstance()
 *
 * # Author: Raj Mohan Singh
 *
 * # Description: This function will get the PDF document handle for further processing of the same.
 *
 * # Input Parameters: String : path of the PDF file.
 */


FunctionLibrary.prototype.fnPdfGetInstance = function (pdfPath) {
    var self = this;
    var d = webdriver.promise.defer();
    PDFJS.workerSrc = ".\\node_modules\\pdfjs-dist\\lib";
    self.fnLogInfo("In fnPdfGetInstance");
    PDFJS.getDocument(pdfPath).then(function (pdf) {
        d.fulfill(pdf);
    }, function (e) {
        d.fulfill(false);
        self.fnLogError("Error - " + e.message);
    });
    return d.promise;
};

/*
 * # Function Name: fnPdfTextPage()
 *
 * # Author: Raj Mohan Singh
 *
 * # Description: This function will fetch the text of a specific page from the PDF file.
 *
 * # Input Parameters: Int : page number of the pdf file .
 */

FunctionLibrary.prototype.fnPdfTextPage = function (PageNum, pdfDocument) {
    var self = this;
    var d = webdriver.promise.defer();
    //self.fnLogInfo(pdfDocument);
    if (PageNum > pdfDocument.pdfInfo.numPages) {
        d.fulfill(false);
        self.fnLogError("Page Number entered is out of range!!!Total number of pages are : " + pdfDocument.pdfInfo.numPages);
    } else {
        getPageText(PageNum + 1, pdfDocument).then(function (textPage) {
            self.fnLogInfo(PageNum + "Page Number" + textPage);
            d.fulfill(textPage);
        }, function (e) {
            d.fulfill(false);
            self.fnLogError("Error - " + e.message);
        });
    }
    return d.promise;
};

/*
 * # Function Name: fnPdfTextallPages()
 *
 * # Author: Raj Mohan Singh
 *
 * # Description: This function will fetch the text of all pages of the given PDF file.
 *
 * # Input Parameters: NA .
 */

FunctionLibrary.prototype.fnPdfTextallPages = function (pdfDocument) {
    var self = this;
    var d = webdriver.promise.defer();
    var pagesText = [];
    self.fnLogInfo("Total Number of Pages are : " + pdfDocument.pdfInfo.numPages)
    for (var i = 0; i < pdfDocument.pdfInfo.numPages; i++) {
        // Required to prevent that i is always the total of pages
        (function (pageNumber) {
            //pagesText.push(getPageText(pageNumber, pdfDocument));
            getPageText(pageNumber, pdfDocument).then(function (textPage) {
                pagesText.push(textPage);
                if (pageNumber == pdfDocument.pdfInfo.numPages - 1) {
                    self.fnLogInfo(pagesText);
                    d.fulfill(pagesText);
                }
            });
        })(i + 1);
    }

    return d.promise;
};

/*
 * # Function Name: getPageText()
 *
 * # Author: Raj Mohan Singh
 *
 * # Description: This is internal function and Retrieves the text of a specif page within a PDF Document.
 *
 * # Input Parameters:  Int : page number of the pdf file, Object: Object containing PDF instance.
 */

function getPageText(pageNum, PDFDocumentInstance) {
    var self = this;
    var d = webdriver.promise.defer();
    PDFDocumentInstance.getPage(pageNum).then(function (pdfPage) {
        // The main trick to obtain the text of the PDF page, use the getTextContent method
        pdfPage.getTextContent().then(function (textContent) {
            var textItems = textContent.items;
            var finalString = "";

            // Concatenate the string of the item to the final string
            for (var i = 0; i < textItems.length; i++) {

                var item = textItems[i];

                finalString += item.str + " ";
            }
            // self.fnLogInfo('Final String for the page : '+finalString );
            d.fulfill(finalString);
        }, function (e) {
            d.fulfill(false);
            self.fnLogError("Error - " + e.message);
        });
    }, function (e) {
        d.fulfill(false);
        self.fnLogError("Error - " + e.message);
    });
    return d.promise;
};

//-------------------------------------Image Operation----------------------
/*
 * # Function Name: fnGetElementCSSvalue()
 *
 * # Author: Raj Mohan Singh
 *
 * # Description: This function will fetch the attribute value of CSS of a given element.
 *
 * # Input Parameters:  Input Parameters: WebElement : Web element ,String : Attribute name of CSS for a element.
 */
FunctionLibrary.prototype.fnGetElementCSSvalue = function (element, attribute) {
    var self = this;
    var d = webdriver.promise.defer();
    this.driver.findElement(element).then(function (elem) {
        elem.getCssValue(attribute).then(function (value) {
            self.fnLogInfo(value);
            d.fulfill(value);
        }, function (e) {
            self.fnLogError("Error - " + e.message);
            assert.equal(true, false, "Error - " + e.message);
            d.fulfill(false);
        })

    }, function (e) {
        self.fnLogError("Error - " + e.message);
        assert.equal(true, false, "Error - " + e.message);
        d.fulfill(false);


    });
    return d.promise;
};

/*
 * # Function Name: fnImageCompare()
 *
 * # Author: Raj Mohan Singh
 *
 * # Description: This function will fetch the text of all pages of the given PDF file..
 *
 * # Input Parameters:  String : Path of Image1 which is original image, String: Path of Image2 which is downloaded image.
 */
FunctionLibrary.prototype.fnImageCompare = function (Image1, Image2) {
    var d = webdriver.promise.defer();
    console.log("In Compare Image");
    resemble(Image1)
        .compareTo(Image2).ignoreColors()
        .onComplete(function (data) {
            console.info('Reached oncomplete for request_cors');
            console.log(data);
            assert.equal(data.dimensionDifference.height, 0);
            assert.equal(data.dimensionDifference.width, 0);
            assert.equal(data.isSameDimensions, true);
            d.fulfill(data);
        }, function (e) {
            self.fnLogError("Error - " + e.message);
            assert.equal(true, false, "Error - " + e.message);
            d.fulfill(false);
        });
    return d.promise;
};

/*
 * # Function Name: fndownload()
 *
 * # Author: Raj Mohan Singh
 *
 * # Description: This function will fetch the text of all pages of the given PDF file..
 *
 * # Input Parameters:  String : Url of the image, filename: Path and name of the download image .
 */
FunctionLibrary.prototype.fndownload = function (uri, filename) {
    var self = this;
    var d = webdriver.promise.defer();
    console.log('IN Download');
    request.head(uri, function (err, res, body) {
        if (err) {
            self.fnLogError("Error - " + err.message);
            d.fulfill(false);
            assert.equal(true, false, "Error - " + err.message);
        } else {
            console.log('content-type:', res.headers['content-type']);
            console.log('content-length:', res.headers['content-length']);
            request(uri).pipe(fs.createWriteStream(filename)).on('error', function (err) {
                self.fnLogError("Error - " + err.message);
                d.fulfill(false);
                assert.equal(true, false, "Error - " + err.message);
            })

                .on('close', function () {
                    d.fulfill(true);
                });
        }
    });
    return d.promise;
};



//-----------------------------------------------------------------
/*
 * # Function Name: fnLog()
 *
 * # Author: Pluto NIX Team
 *
 * # Description: This function logs data using log4j
 *
 * # Input Parameters:
 * String : Text to log.
 * Boolean: Is error log.
 */
FunctionLibrary.prototype.fnLog = function (text, error) {
    var logger = require('./log4js.js');
    var log = logger.LOG;
    error ? log.error(text) : log.info(text);

    return true;
};

/*
 * # Function Name: fnLogInfo()
 *
 * # Author: Pluto NIX Team
 *
 * # Description: This function logs data using log4j
 *
 * # Input Parameters: String : Text to log.
 */
FunctionLibrary.prototype.fnLogInfo = function (text) {
    return this.fnLog(text);
};

/*
 * # Function Name: fnLogError()
 *
 * # Author: Pluto NIX Team
 *
 * # Description: This function logs data using log4j
 *
 * # Input Parameters: String : Text to log.
 */
FunctionLibrary.prototype.fnLogError = function (text) {
    return this.fnLog(text, true);
};

/*
 * # Function Name: fnCompareData()
 *
 * # Author: Pluto NIX Team
 *
 * # Description: 
 *      This function compares actual value with expected.
 *      It fails assert with the message been passed
 *
 * # Input Parameters: 
 *      String : Actual Value
 *      String : Expected Value
 *      String : Message to show if comparison fails
 */
FunctionLibrary.prototype.fnCompareData = function (actualValue, expectedValue, message) {
    assert.equal(actualValue, expectedValue, message);
};

/*
 * # Function Name: fnwait()
 *
 * # Author: Pluto NIX Team
 *
 * # Description: 
 *      This function makes test execution to sleep with passed wait time
 *
 * # Input Parameters: 
 *      Int : Time to sleep
 */
FunctionLibrary.prototype.fnwait = function (time) {
    this.driver.sleep(time);
};

/*
 * # Function Name: fnclear()
 *
 * # Author: Pluto NIX Team
 *
 * # Description: 
 *      This function clears text from textbox/textarea
 *
 * # Input Parameters: 
 *      element : Webelement on which operation is to be performed
 */
FunctionLibrary.prototype.fnClear = function (element) {
    var self = this;
    var d = webdriver.promise.defer();
    this.driver.findElement(element).clear().then(function () {
        self.fnLogInfo("Pass - Element has been cleared successfully.")
        assert.equal(true, true, "Pass - Element has been cleared successfully.");
        d.fulfill(true);
    }, function (e) {
        d.fulfill(false);
        assert.equal(true, false, "Error - " + e.message);
        self.fnLogError("Error - " + e.message)
    });
    return d.promise;
};


FunctionLibrary.prototype.fnExcelData = function (data) {
    var self = this;
    var d = webdriver.promise.defer();
    console.log("length of data array"+data.length)
     var path = ".\\src\\example\\datafile\\SampleExcel.xlsx";
     var sheetName = "ApiInputs";
     var rowVal,row;

    //   for (var arrIndex = 0; arrIndex<=data.length-1; arrIndex++) {
    //       console.log(data[arrIndex]);
    //          }

try{

var workBook = new Excel.Workbook();
workBook.xlsx.readFile(path).then(function () {	
	
      for (var arrIndex = 0; arrIndex<=data.length-1; arrIndex++) {
          //console.log(data[arrIndex]);
          var workSheet=workBook.getWorksheet(sheetName);
          row =data[arrIndex].id;
          cellData = data[arrIndex].value;
          console.log("row-"+row+"value"+cellData)
          rowVal = workSheet.getRow(row);
          console.log("rowVal"+rowVal);
          rowVal.getCell(10).value = cellData;
          rowVal.commit();
             }
    
	 workBook.xlsx.writeFile(path).then(function(){	
		log.info("Pass - saved the file!!! Please check");
	
	}, function (e) {
		promDefer.fulfill(false);
		log.error("Error - "+e.message);

	});
	}, function (e) {
		promDefer.fulfill(false);
		log.error("Error - "+e.message);

	});

}
catch(e)
{
    functionLibrary.fnLogError("Error !!"+e.message);
}

    return d.promise;
};





module.exports = FunctionLibrary;
