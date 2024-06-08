import { defaultContainerId } from "./constants";
import { ReactBrowserTestsWindowObject, TestContainerState, TestType } from "./types";

declare global {
  interface Window {
    reactBrowserTests: ReactBrowserTestsWindowObject;
  }
}

export const getContainerState = (
  containerId: string = defaultContainerId,
  windowRef?: Window): TestContainerState | undefined => {
  const allContainers = (windowRef || window).reactBrowserTests.testContainers;
  const containerState = allContainers.find((containerState) => containerState.containerId === containerId)

  if (!containerState) {
    debugger;
    throw new Error(`getContainerState - container with ID '${containerId}' not found.`);
  }

  return containerState;
}

export const getTestRecord = (containerId: string = defaultContainerId, windowRef?: Window): Record<string, TestType> => {
  windowRef = windowRef || window;
  const containerState = windowRef.reactBrowserTests.getContainerState(containerId, windowRef);
  return containerState?.tests ?? {};
}

export const getTestArray = (containerId: string = defaultContainerId, windowRef?: Window): TestType[] => {
  windowRef = windowRef || window;
  const testRecord = windowRef.reactBrowserTests.getTestRecord(containerId, windowRef);
  return Object.values(testRecord);
}

// For a single container, check if all the tests are complete.
export const checkIfContainerTestsComplete = (containerId: string = defaultContainerId, windowRef?: Window): boolean => {
  windowRef = windowRef || window;
  const testArray = windowRef.reactBrowserTests.getTestArray(containerId, windowRef);
  return testArray.every(test => test.state !== "Pending" && test.state !== "Running");
}

// For all the containers in a page, check if all the tests are complete.
export const checkIfAllContainerTestsComplete = (windowRef?: Window): boolean => {
  windowRef = windowRef || window;
  const allContainerStates = windowRef.reactBrowserTests.testContainers ?? [];

  return allContainerStates.every(containerState => {
    return windowRef!.reactBrowserTests.checkIfContainerTestsComplete(containerState.containerId, windowRef);
  });
}

export const sumTotalNumberOfTests = (windowRef?: Window): number | null => {
  const allContainers = (windowRef || window).reactBrowserTests.testContainers;
  const totalNumTestsMissingFromSomeContainers = allContainers.some(containerState => !containerState.totalNumberOfTests);

  if (allContainers.length === 0 || totalNumTestsMissingFromSomeContainers) {
    return null;
  }

  return allContainers.reduce((acc, containerState) => acc + containerState.totalNumberOfTests!, 0);
}

export const checkIfAllTestsRegistered = (windowRef?: Window): boolean => {
  windowRef = windowRef || window;
  const totalNumTestsFromAllContainers = windowRef.reactBrowserTests.sumTotalNumberOfTests(windowRef);

  if (totalNumTestsFromAllContainers === null) {
    return false;
  }

  let totalNumTestsRegistered = 0;
  for (const containerState of windowRef.reactBrowserTests.testContainers) {
    const currentContainerNumTestsRegistered = Object.keys(containerState.tests).length;
    totalNumTestsRegistered += currentContainerNumTestsRegistered;
  }

  return totalNumTestsRegistered === totalNumTestsFromAllContainers;
}

export const updateWindowObject = (
  containerState: TestContainerState,
  containerId: string = defaultContainerId): void => {
  if (!document.getElementById(containerId)) {
    throw new Error(`updateWindowObject - container with ID '${containerId}' not found.`);
  }

  if (!window.reactBrowserTests) {
    window.reactBrowserTests = {
      testContainers: [],
      getContainerState,
      getTestRecord,
      getTestArray,
      checkIfContainerTestsComplete,
      checkIfAllContainerTestsComplete,
      sumTotalNumberOfTests,
      checkIfAllTestsRegistered
    };
  }

  const containerStateIndex = window.reactBrowserTests.testContainers.findIndex((state) => state.containerId === containerId);

  if (containerStateIndex === -1) {
    window.reactBrowserTests.testContainers.push(containerState);
  } else {
    window.reactBrowserTests.testContainers[containerStateIndex] = containerState;
  }
}
