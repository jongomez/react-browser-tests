import logUpdate from 'log-update';
import type { Browser, Page, PuppeteerLaunchOptions } from 'puppeteer';
import puppeteer from 'puppeteer';
import { groupTests } from '../../testHelpers';
import { TestContainerState } from '../../types';
import { checkIfAllContainerTestsComplete, checkIfAllTestsRegistered } from '../../window';

function prettyPrintTestContainerStates(testContainerStates: TestContainerState[]): string {
  let finalString = "";
  const numberOfContainers = testContainerStates.length;

  for (const containerState of testContainerStates) {
    const tests = containerState.tests;
    const testsArray = Object.values(tests);
    const groupedTests = groupTests(testsArray, "(no test group)");
    const containerId = numberOfContainers > 1 ? `Container Id - ${containerState.containerId}:\n` : "";
    finalString += containerId;

    for (const groupTitle of Object.keys(groupedTests)) {
      finalString += `  Group - ${groupTitle}:\n`;

      for (const test of groupedTests[groupTitle]) {
        const isLastTest = testsArray.indexOf(test) === testsArray.length - 1;
        const breakLine = isLastTest ? "" : "\n";
        finalString += `    ${test.title}: ${test.state}${breakLine}`;
      }
    }

    const isLastContainer = testContainerStates.indexOf(containerState) === numberOfContainers - 1;
    finalString += isLastContainer ? "" : "\n\n";
  }

  return finalString;
}

export async function showTestProgress(page: Page): Promise<TestContainerState[]> {
  let allTestsComplete = false;
  let testContainerStates: TestContainerState[] = [];

  console.log("Waiting for all tests to register...");
  await page.waitForFunction(checkIfAllTestsRegistered, { timeout: 10000 });
  console.log("All tests have been registered.");

  console.log("Running tests...");
  while (!allTestsComplete) {
    testContainerStates = await page.evaluate(() => {
      return window.reactBrowserTests;
    });

    if (testContainerStates.length === 0) {
      throw new Error("Could not retrieve testContainerStates from the page context.");
    }

    logUpdate(`${prettyPrintTestContainerStates(testContainerStates)}`);

    // Check if all tests are complete.
    allTestsComplete = await page.evaluate(checkIfAllContainerTestsComplete);

    // Wait for a short interval before checking the test results again.
    await new Promise((resolve) => {
      setTimeout(resolve, 250);
    });
  }

  return testContainerStates;
}

export const goToUrl = async (page: Page, url: string): Promise<void> => {
  // More info on waitUntil here:
  // https://pptr.dev/api/puppeteer.puppeteerlifecycleevent
  const response = await page.goto(url, { waitUntil: 'networkidle0' });

  if (!response) {
    throw new Error('Response object is null');
  }

  if (response.status() === 404) {
    throw new Error('404: Page not found. URL: ' + url);
  }
}

export type BrowserAndPage = {
  browser: Browser;
  page: Page;
}

export const defaultPuppeteerLaunchOptions: PuppeteerLaunchOptions = {
  headless: true,
  args: ['--no-sandbox', '--disable-setuid-sandbox']
};

export const initBrowserAndPage = async (
  log: boolean,
  puppeteerLaunchOptions: PuppeteerLaunchOptions = defaultPuppeteerLaunchOptions
): Promise<BrowserAndPage> => {
  const browser = await puppeteer.launch(puppeteerLaunchOptions);
  const page = await browser.newPage();

  if (log) {
    // Taken from:
    // https://stackoverflow.com/questions/47539043/how-to-get-all-console-messages-with-puppeteer-including-errors-csp-violations
    page.on('console', message =>
      console.log(`${message.type().substr(0, 3).toUpperCase()} ${message.text()}`))
      .on('pageerror', ({ message }) => console.log("ERROR -", message))
    // .on('response', response =>
    //   console.log(`${response.status()} ${response.url()}`))
    // .on('requestfailed', request =>
    //   console.log(`${request.failure()?.errorText} ${request.url()}`))
  }

  return { browser, page };
}