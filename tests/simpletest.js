'use strict';

/**
 * Very simple in-browser unit-test library, with zero deps.
 *
 * Background turns green if all tests pass, otherwise red.
 * View the JavaScript console to see failure reasons.
 *
 * Example:
 *
 *   adder.js (code under test)
 *
 *     function add(a, b) {
 *       return a + b;
 *     }
 *
 *   adder-test.html (tests - just open a browser to see results)
 *
 *     <script src="tinytest.js"></script>
 *     <script src="adder.js"></script>
 *     <script>
 *
 *     tests({
 *
 *       'adds numbers': function() {
 *         eq(6, add(2, 4));
 *         eq(6.6, add(2.6, 4));
 *       },
 *
 *       'subtracts numbers': function() {
 *         eq(-2, add(2, -4));
 *       },
 *
 *     });
 *     </script>
 *
 * That's it. Stop using over complicated frameworks that get in your way.
 *
 * -Joe Walnes
 * MIT License. See https://github.com/joewalnes/jstinytest/
 */

var TinyTest = {
  run: function(tests) {
    var failures = 0;

    this.render();
    var appView = document.querySelector('#app');
    appView.setAttribute('style', 'flex: 1 0 230px');

    for (var testName in tests) {
      var testAction = tests[testName];
      try {
        testAction.apply(this);
        console.log('%c' + testName, "color: green; font-weight: bold;");
        this.renderTest(testName, 'ok');
      } catch (e) {
        failures++;
        console.groupCollapsed('%c' + testName, "color: red;");
        console.error(e.stack);
        console.groupEnd();
        this.renderTest(testName, e);
      }
    }

    this.renderStats(tests, failures);

    // setTimeout(function () { // Give document a chance to complete
    // if (window.document && document.body) {
    var body = document.body;
    body.setAttribute('style', 'display: flex; width: 100vw; max-width: 100vw; margin: 0;');
    // }
    // }, 0);
  },

  fail: function(msg) {
    throw new Error('fail(): ' + msg);
  },

  assert: function(value, msg) {
    if (!value) {
      throw new Error('assert(): ' + msg);
    }
  },

  assertEquals: function(expected, actual) {
    if (expected != actual) {
      throw new Error('assertEquals() "' + expected + '" != "' + actual + '"');
    }
  },

  assertStrictEquals: function(expected, actual) {
    if (expected !== actual) {
      throw new Error('assertStrictEquals() "' + expected + '" !== "' + actual + '"');
    }
  },

  // Render
  render: function() {
    var testsView = document.createElement('div');
    testsView.id = 'tests';
    testsView.style.margin = '10px 0 10px 10px';
    var testsSummary = document.createElement('h3');
    testsSummary.id = 'tests-summary';
    testsSummary.style.textAlign = 'center';
    testsView.append(testsSummary);

    var disclaimer = document.createElement('div');
    disclaimer.textContent = "Check the console to see error's stacks";
    disclaimer.style.textAlign = 'center';
    disclaimer.style.fontStyle = 'italic';
    testsView.append(disclaimer);

    var tests = document.createElement('div');
    tests.classList.add('tests-info');
    tests.setAttribute('style', 'margin: 20px;');
    testsView.append(tests);

    document.body.prepend(testsView);
  },
  renderTest: function(testName, error) {
    var testsView = document.querySelector('#tests .tests-info');
    var test = document.createElement('div');
    test.classList.add('test');
    test.setAttribute('style', 'margin: 5px 0;');
    var info = document.createElement('div');
    info.classList.add('info');
    info.setAttribute('style', 'width: 100%; display: flex;');
    var description = document.createElement('span');
    description.classList.add('description');
    var status = document.createElement('span');
    status.classList.add('status');
    status.style.marginLeft = 'auto';
    status.style.paddingLeft = '5px';

    var testError = document.createElement('div');
    testError.classList.add('error');

    description.textContent = testName;
    info.append(description);
    info.append(status);
    test.append(info);
    test.append(testError);
    if (error === 'ok') {
      status.textContent = 'passed';
      test.setAttribute('style', 'background: #99ff99; padding: 5px;');
    } else {
      status.textContent = 'failed';
      testError.textContent = error.message;
      test.setAttribute('style', 'background: #ff9999; padding: 5px;');
    }

    testsView.append(test);
  },

  renderStats: function(tests, failures) {
    var numberOfTests = Object.keys(tests).length;
    var successes = numberOfTests - failures;
    var summaryString = 'Ran ' + numberOfTests + ' tests: '
      + successes + ' successes, '
      + failures + ' failures.';

    var testsSummary = document.querySelector('#tests-summary');
    testsSummary.textContent = summaryString;
    testsSummary.style.textAlign = 'center';
  }
};

var fail = TinyTest.fail.bind(TinyTest),
  assert = TinyTest.assert.bind(TinyTest),
  assertEquals = TinyTest.assertEquals.bind(TinyTest),
  eq = TinyTest.assertStrictEquals.bind(TinyTest), // alias for assertEquals
  assertStrictEquals = TinyTest.assertStrictEquals.bind(TinyTest),
  tests = TinyTest.run.bind(TinyTest);
