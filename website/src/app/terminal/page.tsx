"use client"

import { PrismLight as SyntaxHighlighter } from 'react-syntax-highlighter';
import bash from 'react-syntax-highlighter/dist/esm/languages/prism/bash';
import tsx from 'react-syntax-highlighter/dist/esm/languages/prism/tsx';
import prism from 'react-syntax-highlighter/dist/esm/styles/prism/prism';

SyntaxHighlighter.registerLanguage('tsx', tsx);
SyntaxHighlighter.registerLanguage('bash', bash);

export default function TerminalPage() {
  return (
    <>
      <h2>Running in a terminal</h2>
      <p>The React Browser Tests package provides some utilities to facilitate running tests via terminal.
        A headless browser (e.g. puppeteer) is necessary. tsx is also recommended to run the tests. These packages are not included in the React Browser Tests package. They can be installed with:</p>

      <SyntaxHighlighter language="bash" style={prism}>
        {`yarn add --dev puppeteer tsx`}
      </SyntaxHighlighter>

      <h3>Example script - puppeteer</h3>

      <p>Below is an example script that uses puppeteer. It receives a URL of a page with tests, and runs the tests in a headless browser. The script logs the test results to the console.</p>
      <SyntaxHighlighter language="tsx" style={prism}>
        {`import * as puppeteer from "puppeteer";
import { getNumFailedTests } from "react-browser-tests";
import { TestScriptYargsArgv, defaultPuppeteerLaunchOptions, goToUrl, initPage, showTestProgress, testScriptYargsArgv } from "react-browser-tests/scripts";

// Function to launch Puppeteer and visit a URL in headless mode.
async function runTestsOnUrl(url: string, log: boolean) {
  const browser = await puppeteer.launch(defaultPuppeteerLaunchOptions);
  const page = await initPage(browser, log);
  await goToUrl(page, url);

  // Wait until all tests are complete. Show the test results on the console.
  const testContainerStates = await showTestProgress(page);
  const numFailedTest = getNumFailedTests(testContainerStates);

  if (numFailedTest) {
    console.error(\`\${numFailedTest} test(s) failed.\`);
  } else {
    console.log("All tests passed ✨");
  }

  await browser.close();
}

runTestsOnUrl((testScriptYargsArgv as TestScriptYargsArgv).url, (testScriptYargsArgv as TestScriptYargsArgv).log).catch(error => {
  console.error("Error running tests on URL:", error);
  process.exit(1);
});
`}

      </SyntaxHighlighter>

      <p>If we create a file called <code>puppeteerScriptExample.ts</code> with the above script, we can run it with:</p>

      <SyntaxHighlighter language="bash" style={prism}>
        {`npx tsx puppeteerScriptExample.ts -u <test page url>`}
      </SyntaxHighlighter>

      <h3>Terminal helpers - puppeteer</h3>

      <div className="grid-container">
        <div>defaultPuppeteerLaunchOptions</div>
        <div><p>Basic launch option for puppeteer. Currently looks like this:</p>
          <SyntaxHighlighter language="tsx" style={prism}>
            {`const defaultPuppeteerLaunchOptions = {
  headless: true,
  args: ['--no-sandbox', '--disable-setuid-sandbox']
};`}
          </SyntaxHighlighter>
        </div>

        <div>initPage</div>
        <div>
          <p>Async function. Initializes a page in a browser. Example usage:</p>
          <SyntaxHighlighter language="tsx" style={prism}>
            {`import * as puppeteer from "puppeteer";
import { defaultPuppeteerLaunchOptions, initPage } from "react-browser-tests/scripts";

const browser = await puppeteer.launch(defaultPuppeteerLaunchOptions);
const page = await initPage(browser, true);`}
          </SyntaxHighlighter>
        </div>

        <div>showTestProgress</div>
        <div>
          <p>Async function. Receives a puppeteer page. Runs all the tests in a page and resolves when all the tests have finished. Returns the states of all the test containers in the page.</p>
        </div>

        <div>goToUrl</div>
        <div>
          <p>Async function. Receives a puppeteer page and a URL. Navigates to the URL.</p>
        </div>
      </div>

      <h3>Other things that may help</h3>

      <p>React Browser Tests adds an object to the window global: <code>window.reactBrowserTests</code>. This object contains the following:</p>

      <SyntaxHighlighter language="tsx" style={prism}>
        {`type ReactBrowserTestsWindowObject = {
  testContainers: TestContainerState[];
  getContainerState: (containerId?: string, windowRef?: Window) => TestContainerState | undefined;
  getTestRecord: (containerId?: string, windowRef?: Window) => Record<string, TestType>;
  getTestArray: (containerId?: string, windowRef?: Window) => TestType[];
  checkIfContainerTestsComplete: (containerId?: string, windowRef?: Window) => boolean;
  checkIfTestsFromAllContainersComplete: (windowRef?: Window) => boolean;
  sumTotalNumberOfTests: (windowRef?: Window) => number | null;
  checkIfAllTestsRegistered: (windowRef?: Window) => boolean;
}`}
      </SyntaxHighlighter>


      <p>These properties can be accessed by a puppeteer script. Here&apos;s an example of how to fetch the container states:</p>

      <SyntaxHighlighter language="tsx" style={prism}>
        {`// page is a puppeteer page object.
testContainerStates = await page.evaluate(() => {
  return window.reactBrowserTests.testContainers;
});`}
      </SyntaxHighlighter>

      <p>The window functions and script helpers are available in the following files:</p>

      <ul className="link-list">
        <li><a href="https://github.com/jongomez/react-browser-tests/blob/main/package/src/scripts/puppeteer/puppeteerHelpers.ts" target="_blank" rel="noreferrer">puppeteerHelpers.ts</a></li>
        <li><a href="https://github.com/jongomez/react-browser-tests/blob/main/package/src/lib/window.ts" target="_blank" rel="noreferrer">window.ts</a></li>
      </ul>
    </>
  );
}
