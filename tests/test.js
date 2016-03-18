
function Tester(browser) {
    this.browser = browser;
}

Tester.prototype.testPen = function () {
    this.browser
        .click('#pen')
        
        .clearValue('#line-size')
        .clearValue('#color')
        
        .setValue('#line-size', 10)
        .setValue('#color', '#09f')
        
        .pause(100)
        .click('canvas')
    return this;
}

Tester.prototype.begin = function () {
    this.browser
        .url('file:///home/maciek/DATA/Coding/JS/paint-online/index.html')
        .waitForElementVisible('body', 2000)
    return this;
}

Tester.prototype.end = function () {
    this.browser.pause(2000).end();
};

module.exports = {
    'test': function (browser) {
        new Tester(browser)
            .begin()
            .testPen()
            .end()
    }

}