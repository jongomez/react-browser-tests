
import CryptoJS from 'crypto-js';

import { insideIframePathString } from '.';
import { SetTestContainerState } from '../components/TestContext';
import { BeforeAndAfterFunctions, GroupRecord, TestContainerState, TestRecord, TestState, TestStats, TestType, UpdateTestClosure } from "../types";
import { updateWindowObject } from './window';

// Function to generate SHA-256 hash
function generateHash(input: string): string {
  const hashOutput = CryptoJS.SHA256(input).toString(CryptoJS.enc.Hex);
  return hashOutput;
}

export const isTestComplete = (test: TestType): boolean => {
  return test.state !== "Pending" && test.state !== "Running";
}

export const checkIfAllTestsComplete = (tests: TestRecord): boolean => {
  return Object.values(tests).every(test => isTestComplete(test));
}

export function getInitialContainerState(containerId: string): TestContainerState {
  return {
    tests: {},
    groupRecord: {},
    reRunCount: 0,
    currentTestIndex: 0,
    totalNumberOfTests: null,
    containerId,
  };
}

export async function executeTest(
  curentTest: TestType,
  containerState: TestContainerState,
  updateTest: UpdateTestClosure,
  containerBeforeAndAfterFunctions: BeforeAndAfterFunctions) {
  const { tests, groupRecord } = containerState;
  let resultInfo = '';
  let finalState: TestState = 'Pending';
  const iframeUrlString = insideIframePathString();

  // Execute the test and handle both success and failure
  try {
    let iframeContentWindow: Window = window;
    let iframeContentDocument: Document = document;

    // Handle beforeAll and beforeEach functions.
    handleBeforeFunctions(tests, curentTest, groupRecord, containerBeforeAndAfterFunctions);

    // XXX: test.fn may not be async and not return a promise. "await" will still work though.
    await curentTest.fn(iframeContentWindow, iframeContentDocument);

    console.log(`${iframeUrlString}Test "${curentTest.title}" passed ✓`);
    finalState = "Success";
  } catch (error) {
    let errorMessage = `${iframeUrlString}Test "${curentTest.title}" failed: `;
    errorMessage += (error instanceof Error) ? error.message : JSON.stringify(error);
    resultInfo = errorMessage;
    finalState = "Fail";

    throw error;
  } finally {
    const updatedTest = { ...curentTest, state: finalState, resultInfo };
    const newContainerState = updateTest(updatedTest);

    // Check if all tests have been processed.
    if (checkIfAllTestsComplete(newContainerState.tests)) {
      console.log(`${iframeUrlString}Done ✨`);
    }

    // Handle afterAll and afterEach functions.
    handleAfterFunctions(newContainerState.tests, updatedTest, groupRecord, containerBeforeAndAfterFunctions);
  }
};


export const handleAfterFunctions = (
  tests: TestRecord,
  currentTest: TestType,
  groupRecord: GroupRecord,
  containerBeforeAndAfterFunctions: BeforeAndAfterFunctions
) => {
  const testsArray = Object.values(tests);

  //
  ////
  ////// Container level functions:
  const containerAfterAll = containerBeforeAndAfterFunctions.afterAll;
  const containerAfterEach = containerBeforeAndAfterFunctions.afterEach;
  const allContainerTestsCompleted = testsArray.every(test => isTestComplete(test));


  if (containerAfterAll && allContainerTestsCompleted) {
    containerAfterAll(tests);
  }

  if (containerAfterEach) {
    containerAfterEach();
  }

  //
  ////
  ////// Group level functions:
  if (!currentTest.groupTitle) {
    return;
  }

  const currentGroup = groupRecord[currentTest.groupTitle];

  if (!currentGroup) {
    throw new Error(`Group "${currentTest.groupTitle}" not found.`);
  }

  const groupAfterAll = currentGroup.afterAll;
  const groupAfterEach = currentGroup.afterEach;
  const currentGroupTests = testsArray.filter(test => test.groupTitle === currentTest.groupTitle);
  const allGroupTestsCompleted = currentGroupTests.every(test => isTestComplete(test));

  if (groupAfterAll && allGroupTestsCompleted) {
    groupAfterAll(tests);
  }

  if (groupAfterEach) {
    groupAfterEach();
  }
}

export function getTestStats(tests: TestType[]): TestStats {
  const total = tests.length;
  const passed = tests.filter(test => test.state === 'Success').length;
  const failed = tests.filter(test => test.state === 'Fail').length;
  const skipped = tests.filter(test => test.state === 'Skipped').length;
  const pending = tests.filter(test => test.state === 'Pending').length;
  const running = tests.filter(test => test.state === 'Running').length;

  let overallState: TestState;

  if (running > 0) {
    overallState = "Running";
  } else if (failed > 0) {
    overallState = "Fail";
  } else if (pending === total) {
    overallState = "Pending";
  } else if (skipped === total) {
    overallState = "Skipped";
  } else if (passed + skipped === total) {
    overallState = "Success";
  } else {
    overallState = "Pending";
  }

  return {
    total,
    passed,
    failed,
    skipped,
    pending,
    running,
    state: overallState
  };
}

export function toValidDOMId(id: string): string {
  // Remove invalid characters
  let finalId = id.replace(/\W/g, '-');
  finalId = finalId.replace(/--+/g, '-'); // Remove multiple consecutive hyphens
  finalId = finalId.replace(/^-|-$/g, ''); // Remove leading and trailing hyphens
  finalId = finalId.toLowerCase();

  // Ensure ID does not start with a digit, hyphen, or period
  if (/^[0-9\-:.]/.test(finalId)) {
    finalId = '_' + finalId;
  }

  // Hash the original id, to make sure the replacements we made don't generate duplicate IDs.
  const hash = generateHash(id);
  finalId = `${finalId}-${hash.substring(0, 6)}`;

  return finalId;
}


export const waitFor = async (condition: () => boolean, maxWaitMilliseconds = 5000): Promise<void> => {
  // Create an error at the start of the function, for a better stack trace.
  const callerError = new Error("waitFor error");

  return new Promise((resolve, reject) => {
    const startTime = Date.now(); // Record the start time

    const interval = setInterval(() => {
      if (condition()) {
        clearInterval(interval);
        resolve();
      } else if (Date.now() - startTime > maxWaitMilliseconds) { // Check if the max wait time has passed
        clearInterval(interval);

        callerError.message = 'timed out waiting for condition to be true';
        reject(callerError);
      }
    }, 100);
  });
}

export const updateTest = (
  test: TestType,
  updateIndex: boolean,
  containerId: string,
  containerState: TestContainerState,
  setContainerState: SetTestContainerState,
): TestContainerState => {
  // XXX: DANGER: Assumes containerState is up to date every time this function is called.
  // Calling setContainerState((prevState) => { ... }) would always guarantee an up to date state, but
  // this function also returns the new state. setContainerState does not return anything.
  const newContainerState: TestContainerState = {
    ...containerState,
    tests: {
      ...containerState.tests,
      [test.id]: test
    },
    currentTestIndex: updateIndex ? containerState.currentTestIndex + 1 : containerState.currentTestIndex
  };

  setContainerState(newContainerState);

  updateWindowObject(newContainerState, containerId);

  return newContainerState
};

export const handleBeforeFunctions = (
  tests: TestRecord,
  currentTest: TestType,
  groupRecord: GroupRecord,
  containerBeforeAndAfterFunctions: BeforeAndAfterFunctions
) => {
  const testsArray = Object.values(tests);

  //
  ////
  ////// Container level functions:
  const containerBeforeAll = containerBeforeAndAfterFunctions.beforeAll;
  const containerBeforeEach = containerBeforeAndAfterFunctions.beforeEach;
  const noTestsHaveStarted = testsArray.every(test => test.state === "Pending");

  if (containerBeforeAll && noTestsHaveStarted) {
    containerBeforeAll(tests);
  }

  if (containerBeforeEach) {
    containerBeforeEach();
  }

  //
  ////
  ////// Group level functions:
  if (!currentTest.groupTitle) {
    return;
  }

  const currentGroup = groupRecord[currentTest.groupTitle];

  if (!currentGroup) {
    throw new Error(`Group "${currentTest.groupTitle}" not found.`);
  }

  const groupBeforeAll = currentGroup.beforeAll;
  const groupBeforeEach = currentGroup.beforeEach;
  const currentGroupTests = testsArray.filter(test => test.groupTitle === currentTest.groupTitle);
  const groupNoTestsHaveStarted = currentGroupTests.every(test => test.state === "Pending");

  if (groupBeforeAll && groupNoTestsHaveStarted) {
    groupBeforeAll(tests);
  }

  if (groupBeforeEach) {
    groupBeforeEach();
  }
}

export const getContainerIds = (contentDocument: Document, iframeUrl?: string): string[] => {
  const testContainers = contentDocument.querySelectorAll('[data-test-container]');
  const testContainersArray = Array.from(testContainers);
  const containerIds = []

  // Create the initial result object for each test container in this iframe.
  for (const testContainer of testContainersArray) {
    const containerId = testContainer.getAttribute('id');

    if (!containerId) {
      throw new Error("Found a container without an Id. Every container must have an Id.");
    }

    containerIds.push(containerId);
  }

  if (containerIds.length === 0) {
    throw new Error("No test containers found. iframeUrl: " + iframeUrl || "none");
  }

  return containerIds;
}

// Groups the tests together by grouptTitle.
export const groupTests = (
  tests: TestType[],
  noGroupName = ""
): Record<string, TestType[]> => {
  const groupedTests: Record<string, TestType[]> = {};

  tests.forEach(test => {
    // Use the group title if available, otherwise use the default noGroupName.
    const groupName = test.groupTitle || noGroupName;

    // Initialize the group in the dictionary if it hasn't been already.
    if (!groupedTests[groupName]) {
      groupedTests[groupName] = [];
    }

    // Add the test to the appropriate group.
    groupedTests[groupName].push(test);
  });

  return groupedTests;
}
export const getTestArrayFromContainerState = (containerState?: TestContainerState | null): TestType[] => {
  if (!containerState) {
    return [];
  }

  const containerStateTests = containerState?.tests;

  if (!containerStateTests) {
    return [];
  }

  return Object.values(containerState.tests);
}

export const getNumFailedTests = (containerStates: TestContainerState[]): number => {
  let numFailedTests = 0;

  for (const containerState of containerStates) {
    const tests = Object.values(containerState.tests);
    const failedTests = tests.filter(test => test.state === "Fail");
    numFailedTests += failedTests.length;
  }

  return numFailedTests;
}

export const getIconStyles = (state: TestState): string => {
  switch (state) {
    case "Pending":
      return "rbt-icon-pending";
    case "Running":
      return "rbt-icon-running";
    case "Success":
      return "rbt-icon-success";
    case "Fail":
      return "rbt-icon-fail";
    case "Skipped":
      return "rbt-icon-skipped";
    default:
      throw new Error(`Unknown test state: ${state}`);
  }
}

export const getBorderStyles = (state: TestState): string => {
  switch (state) {
    case "Pending":
      return "rbt-border-pending";
    case "Running":
      return "rbt-border-running";
    case "Success":
      return "rbt-border-success";
    case "Fail":
      return "rbt-border-fail";
    case "Skipped":
      return "rbt-border-skipped";
    default:
      throw new Error(`Unknown test state: ${state}`);
  }
}