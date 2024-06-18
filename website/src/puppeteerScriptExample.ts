import * as puppeteer from "puppeteer";
import { getNumFailedTests } from "react-browser-tests";
import { YargsArgv, defaultPuppeteerLaunchOptions, goToUrl, initPage, showTestProgress, yargsArgv } from "react-browser-tests/scripts";

/*

puppeter is required to run this script. It can be installed with:
yarn add --dev puppeteer

tsx is recommended to run this script. It can be installed with:
yarn add --dev tsx

Finally, this script can be run with:
npx tsx puppeteerScriptExample.ts -u <insert url here>

*/

// Function to launch Puppeteer and visit a URL in headless mode
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

runTestsOnUrl((yargsArgv as YargsArgv).url, (yargsArgv as YargsArgv).log).catch(error => {
  console.error("Error running tests on URL:", error);
  process.exit(1);
});
