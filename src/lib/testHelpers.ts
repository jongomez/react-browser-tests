import { TestGroupStateIconProps } from '@/components/TestContainer';
import { SetTestContainerState } from '@/components/TestContext';
import CryptoJS from 'crypto-js';
import { useEffect, useRef } from "react";
import { BeforeAndAfterFunctions, GroupRecord, TestContainerState, TestRecord, TestState, TestStats, TestType, TotalNumberOfTests, UpdateTestClosure } from "./types";
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

async function executeTest(
  curentTest: TestType,
  containerState: TestContainerState,
  updateTest: UpdateTestClosure,
  containerBeforeAndAfterFunctions: BeforeAndAfterFunctions) {
  const { tests, groupRecord } = containerState;
  let resultInfo = '';
  let finalState: TestState = 'Pending';

  // Execute the test and handle both success and failure
  try {
    let iframeContentWindow: Window = window;
    let iframeContentDocument: Document = document;

    // Handle beforeAll and beforeEach functions.
    handleBeforeFunctions(tests, curentTest, groupRecord, containerBeforeAndAfterFunctions);

    // XXX: test.fn may not be async and not return a promise. "await" will still work though.
    await curentTest.fn(iframeContentWindow, iframeContentDocument);

    console.log(`Test "${curentTest.title}" passed ✓`);
    finalState = "Success";
  } catch (error) {
    let errorMessage = `Test "${curentTest.title}" failed: `;
    errorMessage += (error instanceof Error) ? error.message : JSON.stringify(error);
    resultInfo = errorMessage;
    finalState = "Fail";

    throw error;
  } finally {
    const updatedTest = { ...curentTest, state: finalState, resultInfo };
    const newContainerState = updateTest(updatedTest);

    // Check if all tests have been processed.
    if (checkIfAllTestsComplete(newContainerState.tests)) {
      console.log("Done ✨");
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

export const useRunTests = (
  containerState: TestContainerState,
  updateTest: UpdateTestClosure,
  containerBeforeAndAfterFunctions: BeforeAndAfterFunctions) => {
  const { tests, groupRecord, currentTestIndex, reRunCount, totalNumberOfTests } = containerState;
  const registeredTestsNumber = Object.keys(tests).length;
  const allTestsRegistered = totalNumberOfTests !== null && registeredTestsNumber === totalNumberOfTests;
  useCheckForDuplicates(tests, groupRecord);
  const testsArray = Object.values(tests);

  useEffect(() => {
    if (!allTestsRegistered) {
      return;
    }

    if (registeredTestsNumber === 0) {
      console.warn("No tests found :(");
      return;
    }

    if (currentTestIndex >= registeredTestsNumber) {
      console.log(`All tests from container with Id '${containerState.containerId}' have been run.`);
      return;
    }

    if (currentTestIndex === 0) {
      console.log("All tests have been registered. Running tests 1 by 1...");
    }

    // Check if there are any running tests. If yes, return early.
    // const hasRunningTests = testEntries.some(([_, test]) => test.state === "Running");
    const hasRunningTests = testsArray.some(test => test.state === "Running");

    if (hasRunningTests) {
      return;
    }

    // The only flag is used to run only one test. If a test has the only flag, only that test will run.
    const hasOnly = testsArray.some(test => test.only);

    // Fetch the current test to run and its key. The key is the test id.
    // const [key, test] = testEntries[currentTestIndex];
    const curentTest = testsArray[currentTestIndex];
    const skipped = curentTest.skip || (hasOnly && !curentTest.only);

    if (skipped) {
      updateTest({ ...curentTest, state: "Skipped" });
    } else {
      updateTest({ ...curentTest, state: "Running" }, false);
      // Execute the test. 
      // NOTE: this is an async function. Meaning it won't run right away.
      executeTest(
        curentTest,
        containerState,
        updateTest,
        containerBeforeAndAfterFunctions);
    }
  }, [allTestsRegistered, currentTestIndex, reRunCount]);
};


export const getGroupStateFromStats = (testGroupStats: TestStats): TestGroupStateIconProps => {
  const hasPendingTests = testGroupStats.pending > 0;
  const hasRunningTests = testGroupStats.running > 0;
  const hasFailedTests = testGroupStats.failed > 0;
  const allTestsPassed = testGroupStats.total > 0 && testGroupStats.passed === testGroupStats.total;
  const allTestsSkipped = testGroupStats.total > 0 && testGroupStats.skipped === testGroupStats.total;
  const hasSkippedButPassedRemainingTests = testGroupStats.skipped > 0 && testGroupStats.passed > 0 && !hasFailedTests && !hasPendingTests && !hasRunningTests;

  return {
    hasPendingTests,
    hasRunningTests,
    hasFailedTests,
    allTestsPassed,
    allTestsSkipped,
    hasSkippedButPassedRemainingTests
  };
};

export function getTestStats(tests: TestType[]): TestStats {
  const total = tests.length;
  const passed = tests.filter(test => test.state === 'Success').length;
  const failed = tests.filter(test => test.state === 'Fail').length;
  const skipped = tests.filter(test => test.state === 'Skipped').length;
  const pending = tests.filter(test => test.state === 'Pending').length;
  const running = tests.filter(test => test.state === 'Running').length;

  return {
    total,
    passed,
    failed,
    skipped,
    pending,
    running
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

export const useGetTotalNumberOfTests = (
  containerId: string,
  totalTests: TotalNumberOfTests,
  setContainerState: SetTestContainerState,
): void => {
  const didInit = useRef(false);

  useEffect(() => {
    if (totalTests !== null) return;
    if (didInit.current) return;

    const tests = document.querySelectorAll(`[data-test="${containerId}"]`);

    setContainerState(prevState => {
      return {
        ...prevState,
        totalNumberOfTests: tests.length,
      };
    });

    console.log('Total number of tests found:', tests.length);
    console.log('Waiting for the tests to be registered...');

    didInit.current = true;
  }, []);
};

export const useCheckForDuplicates = (tests: TestRecord, groupRecord: GroupRecord,) => {
  useEffect(() => {
    //
    //// Check for duplicate test IDs.
    Object.keys(tests).forEach((key) => {
      const DOMId = toValidDOMId(key);

      const duplicateTest = document.querySelectorAll(`#${DOMId}`).length > 1;

      if (duplicateTest) {
        throw new Error(`Duplicate test ID found: ${key}`);
      }
    });

    //
    //// Check for duplicate group IDs.
    Object.keys(groupRecord).forEach((groupTitle) => {
      const DOMId = toValidDOMId(groupTitle);

      const duplicateGroup = document.querySelectorAll(`#${DOMId}`).length > 1;

      if (duplicateGroup) {
        throw new Error(`Duplicate group ID found: ${groupTitle}`);
      }
    });

    //
    //// Check for duplicate test containers.
    const allContainers = document.querySelectorAll('[data-test-container]');
    const allContainersArray = Array.from(allContainers);
    for (const container of allContainersArray) {
      const containerId = container.getAttribute('data-test-container');
      const duplicateContainer = document.querySelectorAll(`[data-test-container="${containerId}"]`).length > 1;

      if (duplicateContainer) {
        throw new Error(`Containers should have unique Ids. Found duplicate Id: '${containerId}'`);
      }
    }
  }, [tests, groupRecord]);
}

export const waitFor = async (condition: () => boolean, maxWaitMilliseconds = 5000): Promise<void> => {
  return new Promise((resolve, reject) => {
    const startTime = Date.now(); // Record the start time

    const interval = setInterval(() => {
      if (condition()) {
        clearInterval(interval);
        resolve();
      } else if (Date.now() - startTime > maxWaitMilliseconds) { // Check if the max wait time has passed
        clearInterval(interval);
        reject(new Error('waitFor - timed out waiting for condition to be true'));
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

export const getContainerIds = (contentDocument: Document): string[] => {
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
