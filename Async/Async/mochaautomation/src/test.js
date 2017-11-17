/* jslint node: true */
/* global before, afterEach, after, featureFile, scenarios, steps 
This is driver script which drive our automation execution 
*/
"use strict";
var Yadda = require('yadda');
var webdriver = require('selenium-webdriver');
var config = require('config');
var fs = require('fs');
var funLib = require('../lib/function-library.js');
var moment = require('moment');
var mkdirp = require('mkdirp');
var add = require('../src/example/commons/common.js')
const addContext = require('mochawesome/addContext');
var temparr=[];
var arr = add(temparr,"")
var TestRunner = function () {
    var functionLibrary, driver, captureScreenshotOn;
    var projectName = config.get('projectName');
    var suffix = this.getTimestamp();
    var tmpDir = "reports/" + "/" + suffix
    process.env.MOCHAWESOME_REPORTDIR = tmpDir;
    process.env.MOCHAWESOME_REPORTTITLE = "Test Execution Report for " + projectName;
    process.env.MOCHAWESOME_REPORTFILENAME = "TAF Report" + "_" + projectName + "_" + suffix;
}

TestRunner.prototype.execute = function () {
    var self = this;
    Yadda.plugins.mocha.StepLevelPlugin.init();
    if (!this.driver || !this.driver.getSession()) {
        var browser = config.get('browser');
        this.driver = new webdriver
            .Builder()
            .usingServer()
            .withCapabilities({ 'browserName': browser })
            .build();
    }
    if (!this.functionLibrary) {
        this.functionLibrary = new funLib(this.driver);
    }
    var directories = self.getDirectories('src/');
    directories.forEach(function (directory) {
        var features = new Yadda.FeatureFileSearch('src/' + directory + '/features/');
        features.each(function (file) {
            featureFile(file, function (feature) {
                before(function (done) {
                    if (!self.driver || !self.driver.getSession()) {
                        var browser = config.get('browser');
                        self.driver = new webdriver
                            .Builder()
                            .usingServer()
                            .withCapabilities({ 'browserName': browser })
                            .build();
                        self.driver.manage().timeouts().implicitlyWait(10000);
                    }

                    if (!self.functionLibrary) {
                        self.functionLibrary = new funLib(self.driver);
                    }

                    self.functionLibrary.fnLogInfo('Start of the automation test Execution');
                    done();
                });

                scenarios(feature.scenarios, function (scenario) {
                    var libraries = self.getStepFile(file, directory);
                    steps(scenario.steps, function (step, done) {
                        self.executeInFlow(function () {
                            var url = self.getParameterValue('--url');
                            var param = { driver: self.driver };
                            if (url !== '') {
                                param['customUrl'] = url;
                            }
                            new Yadda.Yadda(libraries, param).yadda(step);
                        }, done);
                    });
                });

                afterEach(function () {
                    self.takeScreenshot(this.currentTest, directory);
                     arr = add(arr,"");
                    addContext(this,{title:'Failed Scenarios',value:arr});
                   //console.log("array in test.js"+arr)
                });

                after(function (done) {
                    self.functionLibrary.fnLogInfo('End of the automation test Execution');
                    self.driver.quit().then(done);
                });
            });
        });
    });
}

TestRunner.prototype.executeInFlow = function (fn, done) {
    if(fn){
    webdriver.promise.controlFlow().execute(fn).then(function () {
        done();
    }, done);
    }
}

TestRunner.prototype.takeScreenshot = function (test, directory) {
    var parentDirPath = process.env.MOCHAWESOME_REPORTDIR + "/screenshots/" + directory
    this.captureScreenshotOn = config.get('captureScreenshotOn')
    mkdirp(parentDirPath, function (err) {
        if (err) console.error(err);
    });

    if (this.captureScreenshotOn === "") { this.captureScreenshotOn = 'FAILURE' }
    if ((this.captureScreenshotOn == 'ALL') | (this.captureScreenshotOn == 'FAILURE' && test.state == 'failed')) {
        var path = parentDirPath + '/' + test.title.replace(/\W+/g, '_').toLowerCase() + '.png';
        this.driver.takeScreenshot().then(function (data) {
            fs.writeFileSync(path, data, 'base64');
        });
    }
}

TestRunner.prototype.getStepFile = function (file, directory) {
    var temp = file.split('\\');
    var step = temp[temp.length - 1].split('.')[0];

    if (directory && directory !== '') {
        return require('./' + directory + '/step-definition/' + step + '-step');
    }
    return require('./step-definition/' + step + '-step');
}

TestRunner.prototype.getDirectories = function (path) {
    var module = this.getParameterValue("--m");
    if (module && module !== "") {
        var moduleDir = fs.readdirSync(path).filter(function (file) {
            if (file === module) {
                return fs.statSync(path + '/' + file).isDirectory();
            } else {
                return false;
            }
        });

        if (moduleDir.length === 0) {
            this.functionLibrary.fnLogError(module + " is not a valid module");
        }
        return moduleDir;
    }

    var directories = fs.readdirSync(path).filter(function (file) {
        return fs.statSync(path + '/' + file).isDirectory();
    });

    return directories;
}
TestRunner.prototype.getParameterValue = function (paramName) {
    var processArg = process.argv;
    var indexOfParam = processArg.indexOf(paramName);
    if (indexOfParam > -1) {
        var t = processArg[indexOfParam + 1];
        if (t && t !== undefined && t !== "undefined" && t !== "") {
            return t;
        }
    }
    return "";
}

TestRunner.prototype.getTimestamp = function () {
    var time = moment();
    var time_format = time.format('YYYY-MM-DD HH_mm_ss');
    return time_format;
}

var runner = new TestRunner();
runner.execute();