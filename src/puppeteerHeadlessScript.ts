import { yargsArgv } from './lib/scripts/nodeScriptHelpers';
import { goToUrl, initBrowserAndPage, showTestProgress } from './lib/scripts/puppeteer/puppeteerHelpers';
import { getNumFailedTests } from './lib/testHelpers';

// Function to launch Puppeteer and visit a URL in headless mode
async function runTestsOnUrl(url: string, log: boolean) {
  const { browser, page } = await initBrowserAndPage(log);
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

runTestsOnUrl(yargsArgv.url, yargsArgv.log).catch(error => {
  console.error("Error running tests on URL:", error);
  process.exit(1);
});
