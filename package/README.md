# React Browser Tests

React Browser Tests is a browser first testing library. The tests are written in React and run in a browser. Terminal also works.

React Browser Tests works with NextJS and TypeScript. The assertions are done with [Chai](https://www.chaijs.com/).

## Getting started

The package can be installed with:

```bash
yarn add react-browser-tests
```

## Docs

The full version of the documentation along with some live examples can be found at [https://react-browser-tests.vercel.app/](https://react-browser-tests.vercel.app/)

## Examples

The following example shows a NextJS page with a Test:

```jsx
import { Test, TestContainer, TestGroup, expect } from "react-browser-tests";

export default function TestPage() {
  return (
    <TestContainer>
        <Test title="Expect 1 + 1 to equal 2." fn={() => {
          expect(1 + 1).to.equal(2);
        }} />
    </TestContainer>
  );
}
```

If we navigate to that page, we'll see:

> ✔ Expect 1 + 1 to equal 2.

We can also pass in children to the Test component along with an async test function:

```jsx
<Test title="Expect child component to exist." fn={async () => { 
  // Wait for the child component to be rendered.
  await waitFor(() => !!document.getElementById("child-component"));

  // Assert that the child component has the correct text content.
  expect(document.getElementById("child-component")!.textContent).to.equal("Child component.");
}}>
  <div id="child-component">Child component.</div>
</Test>
```

'waitFor' is a small utility function available in this package. The final result in the browser will look something like:

> ✔ Expect child component to exist.
> 
> Child component.

## Components

The main components provided by the React Browser Tests package are:

| Component                     | Description |
|-------------------------------|-------------|
| `<TestContainer>`             | Container of `<Test>` components. Uses react context to manage the state of the tests. `<Test>` components must have a `<TestContainer>` parent somewhere in the tree. |
| `<Test>`                      | Executes a test function and shows the result in a browser. Optionally, the tests can run in a terminal, via a headless browser for example. The tests in a `<TestContainer>` run sequentially. The child components of each `<Test>` component are only rendered when the test is running or has run. |
| `<TestGroup>`                 | Groups multiple `<Test>` components together. `<Test>` components can be used without a `<TestGroup>` parent. |
| `<SingleTestContainersOverview>` | Shows an overview of all the tests in a single `<TestContainer>` element. |
| `<MultipleTestContainersOverview>` | Shows an overview of all the tests in all `<TestContainer>` elements on a single page. Note: having multiple `<TestContainer>` elements on a page is possible, but it will significantly increase complexity, and may not be working 100% correctly. |
| `<MultiplePageOverview>`      | Receives an array of URLs and shows an overview of all the tests in all the pages. This component creates an iframe for each of the passed in URLs. Then, for each iframe, a `<MultipleTestContainersOverview>` component is used to show an overview of the tests. Currently, a `<TestContainer>` parent element is required (just for the CSS styles. This may change in the future). |
| `<SidebarLayout>`             | Simple sidebar layout UI component. Contains a sidebar with links, a header, and a main content area. Useful when handling multiple test pages. The sidebar and header in this website were built using a `<SidebarLayout>` component. |

### Secondary components

The following are secondary components. They are used internally by the main components listed above, but are also exported as they may potentially be useful:

| Component            | Description |
|----------------------|-------------|
| `<TestStatsDisplay>` | Receives an object with test stats, and shows the results. Example usage: <br> `<TestContainer>`<br> `  <TestStatsDisplay testStats={{ total: 3, passed: 2, failed: 0, skipped: 1, pending: 0, running: 0, state: "Success" }} />`<br>`</TestContainer>` |
| `<TestArrayStats>`   | Receives a groupTitle and an array of tests. This component will render a `<TestStatsDisplay>` component with stats for all the tests in the passed in array. |

## Running in a Terminal

This package provides utilities to facilitate running tests via terminal. A headless browser (e.g., puppeteer) is necessary. `tsx` is also recommended to run the tests. These packages are not included in the React Browser Tests package. They can be installed with:

```bash
yarn add --dev puppeteer tsx
```

### Example Script - Puppeteer

Below is an example script that uses puppeteer. It receives a URL of a page with tests, and runs the tests in a headless browser. The script logs the test results to the console.

```typescript
import * as puppeteer from "puppeteer";
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
    console.error(`${numFailedTest} test(s) failed.`);
  } else {
    console.log("All tests passed ✨");
  }

  await browser.close();
}

runTestsOnUrl((testScriptYargsArgv as TestScriptYargsArgv).url, (testScriptYargsArgv as TestScriptYargsArgv).log).catch(error => {
  console.error("Error running tests on URL:", error);
  process.exit(1);
});
```

If we create a file called `puppeteerScriptExample.ts` with the above script, we can run it with:

```bash
npx tsx puppeteerScriptExample.ts -u <test page url>
```

### Terminal Helpers - Puppeteer

| Function                      | Description |
|-------------------------------|-------------|
| `defaultPuppeteerLaunchOptions` | Basic launch option for puppeteer. Currently has `headless: true` and `args: ['--no-sandbox', '--disable-setuid-sandbox']`|
| `initPage`                    | Async function. Initializes a page in a browser. Example usage:<br><br>`const browser = await puppeteer.launch(defaultPuppeteerLaunchOptions);`<br>`const page = await initPage(browser, true);`<br> |
| `showTestProgress`            | Async function. Receives a puppeteer page. Runs all the tests in a page and resolves when all the tests have finished. Returns the states of all the test containers in the page. |
| `goToUrl`                     | Async function. Receives a puppeteer page and a URL. Navigates to the URL. |

### Other things that may help

React Browser Tests adds an object to the window global: `window.reactBrowserTests`. This object contains the following:

```typescript
type ReactBrowserTestsWindowObject = {
  testContainers: TestContainerState[];
  getContainerState: (containerId?: string, windowRef?: Window) => TestContainerState | undefined;
  getTestRecord: (containerId?: string, windowRef?: Window) => Record<string, TestType>;
  getTestArray: (containerId?: string, windowRef?: Window) => TestType[];
  checkIfContainerTestsComplete: (containerId?: string, windowRef?: Window) => boolean;
  checkIfTestsFromAllContainersComplete: (windowRef?: Window) => boolean;
  sumTotalNumberOfTests: (windowRef?: Window) => number | null;
  checkIfAllTestsRegistered: (windowRef?: Window) => boolean;
}
```

These properties can be accessed by a puppeteer script. Here's an example of how to fetch the container states:

```typescript
// page is a puppeteer page object.
testContainerStates = await page.evaluate(() => {
  return window.reactBrowserTests.testContainers;
});
```

The window functions and script helpers are available in the following files:

- [puppeteerHelpers.ts](https://github.com/jongomez/react-browser-tests/blob/main/package/src/scripts/puppeteer/puppeteerHelpers.ts)
- [window.ts](https://github.com/jongomez/react-browser-tests/blob/main/package/src/lib/window.ts)