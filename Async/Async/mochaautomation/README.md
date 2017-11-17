
# Test Automation Framework
> MD-TAF provides capability for automation of test cases to help teams build comprehensive automated test suite. It facilitates easy installation and setup and provides a full-fledged HTML report that helps visualize test results.

## Latest Changes
* REST API testing
* Configure when to take screenshots using captureScreenshotOn in config/default.json


## Usage Commands
1. Update TAF generator to latest version
    ```bash
    npm install -g yo @markit/generator-test-automation-framework
    ```
2. Create new project
    ```bash
    yo @markit/test-automation-framework
    ```

3. Creating new module in existing project
    ```bash
    yo @markit/test-automation-framework:init
    ```

4. Initializing example module
    ```bash
    yo @markit/test-automation-framework:example
    ```
5. Update Framework
    ```bash
    yo @markit/test-automation-framework:update
    ```
    This command will update defualt.json , Framework Libraray and Example module . Enter y to update n to skip 

## Execution Command
       npm run test
    
#### CLI Options
1. --m moduleName for executing specific module only
              
        npm run test -- --m mutualfund
        
2. --url http://example.com for passing url directly from command line
        
        npm run test -- --m mutualfund --url https://intranet.mgmt.local
        npm run test -- --url https://intranet.mgmt.local
        
## Report and Screenshots
HTML report and screenshots are available in reports folder. Folder with timestamp ensures that a unique folder is created for every execution so that report and screenshot from previous execution are also available
Screenshots taken during test execution are maintained inside screenshots folder


## Confluence Links
1. [TAF Page](https://confluence.markit.com/pages/viewpage.action?spaceKey=MOD&title=Markit+Digital+Test+Automation+Framework)
2. [Available Functions List](https://confluence.markit.com/pages/viewpage.action?pageId=168241761)


## Version Information
## 1.0.6
Features
* Added library for testing Restful APIs, api-library.js
* Added test cases to test api library inside example folder
* Added functions to do image comparisons. "fndownload" and "fnImageCompare"

Bug Fixes
* Fixed bug when running pdf test case. "Cannot read property 'pdfInfo' of null"

# 1.0.5
Features
* Only one command for running test cases locally "npm run test"
* Added functionality to pass url and module as a parameter when runnning test cases
* Integrated with team city. Use command "npm run test-teamcity" while configuring TeamCity
* Added methods for pdf operations
* Updated example with test cases for pdf operations
* Moved example folder inside src

Bug Fixes
* Deleted log folders from the library
* Fixed bug 2 browsers when opening when running test case
* Fixed bug in method fnVerifyDataOfWebtable inside functionlibrary
* Corrected functionality for fnWrite function inside function library

# 1.0.4
Features
* Added log4j for logging 
* Added method for file operations fnVerifyFileExist, fnReadFile, fnWriteFile, fnAppendFile, fnRenameFile, fnMoveFile, fnDeleteFile, fnStatsFile
* Updated example with test cases for each method in function library

Bug Fixes
* Deleted log folders from the library
* Fixed bug 2 browsers when opening when running test case
* Fixed bug in method fnVerifyDataOfWebtable inside functionlibrary
* Corrected functionality for fnWrite function inside function library

# 1.0.2/1.0.3
Features
* Feature to read test cases from excel and csv file
* Added example folder for writing test cases. Test case for ADR site
* Added functionality to run test cases using phatom js
* Modified example to use https://intranet.mgmt.local/D/PTC1/TAFTestPage

# 1.0.1
Features
* Common function library with common methods to interact with page.
* Common page and test level operations for test steps
* Test cases can be run against chrome and firefox browser
* Common config file to store global level variables

