import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { SetTestContainerState, checkIfframeHasTestContainers } from "..";
import { base64TestIdUrlParam, defaultContainerId } from "../constants";
import { BeforeAndAfterFunctions, GroupRecord, TestContainerState, TestRecord, TotalNumberOfTests, UpdateTestClosure } from "../types";
import { executeTest, getContainerIds, toValidDOMId } from "./testHelpers";
import { checkIfContainerTestsComplete, getContainerState, updateWindowObject } from "./window";

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

    setContainerState((prevState: TestContainerState) => {
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

export const useCheckForDuplicates = (tests: TestRecord, groupRecord: GroupRecord) => {
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

export const useIsInsideIframe = (): boolean => {
  const [isInsideIframe, setIsInsideIframe] = useState<boolean>(false);

  useEffect(() => {
    setIsInsideIframe(window.self !== window.top);
  }, []);

  return isInsideIframe;
}

// XXX: Not currently used.
export const useGetTestIdFromUrl = (): string | null => {
  const [testId, setTestId] = useState<string | null>("");

  useEffect(() => {
    const url = new URL(window.location.href);
    const base64TestId = url.searchParams.get(base64TestIdUrlParam);
    const testId = base64TestId ? atob(base64TestId) : null;

    setTestId(testId);
  }, []);

  return testId;
}

export const useInitWindowObject = (containerId: string, containerState: TestContainerState) => {
  useEffect(() => {
    const containerIds = getContainerIds(document);

    // Because we're using the window object, we may have stale data from previous pages.
    // The following removes any info from container Ids that are not in the current page.
    if (window.reactBrowserTests) {
      window.reactBrowserTests.testContainers = window.reactBrowserTests.testContainers.filter(containerState => containerIds.includes(containerState.containerId));
    }

    updateWindowObject(containerState, containerId);
  }, [])
}

export const useCustomRouter = () => {
  const [pathname, setPathname] = useState('');

  useEffect(() => {
    setPathname(window.location.pathname);
  }, []);

  const navigate = (url: string) => {
    window.location.href = url;
  };

  return {
    pathname,
    push: navigate,
  };
};

const getContentWindow = (iframeUrl?: string): Window => {
  if (!iframeUrl) {
    return window;
  }

  const iframe = document.querySelector(`iframe[src="${iframeUrl}"]`) as HTMLIFrameElement;

  if (!iframe) {
    throw new Error(`Could not find iframe with src: ${iframeUrl}`);
  }

  const contentWindow = iframe.contentWindow;

  if (!contentWindow) {
    throw new Error(`Could not get contentWindow for iframe with src: ${iframeUrl}`);
  }

  return contentWindow;
}

export const useGetContainerStateUntilAllTestsFinish = (
  containerId = defaultContainerId,
  iframeUrl?: string,
): TestContainerState | null => {
  const [containerState, setContainerState] = useState<TestContainerState | null>(null);
  const intervalId = useRef<number | null>(null);

  useEffect(() => {
    if (intervalId.current !== null) {
      // If the intervalId is already set, return.
      return;
    }

    const updateContainerState = () => {
      try {
        //
        //// Fetches the container state until all tests are complete (or an error occurs).
        const contentWindow = getContentWindow(iframeUrl);
        let currentContainerState: TestContainerState | undefined;

        currentContainerState = getContainerState(containerId, contentWindow);

        if (!currentContainerState) {
          throw new Error(`Could not get container state for containerId: ${containerId}`);
        }

        const newContainerState: TestContainerState = {
          ...currentContainerState,
          iframeUrl
        };

        setContainerState(newContainerState);

        // Check if all tests are complete. If yes, clear the interval.
        if (checkIfContainerTestsComplete(containerId, contentWindow)) {
          window.clearInterval(intervalId.current || 0);
          return;
        }
      } catch (error) {
        // Clear interval and rethrow the error.
        window.clearInterval(intervalId.current || 0);
        intervalId.current = null;
        throw error;
      };
    }

    intervalId.current = window.setInterval(updateContainerState, 200);

    return () => {
      window.clearInterval(intervalId.current || 0);
      intervalId.current = null;
    }
  }, []);

  return containerState;
};

export const useGetContainerIds = (iframeUrl?: string): string[] => {
  const [containerIds, setContainerIds] = useState<string[]>([]);

  useEffect(() => {
    const contentWindow = getContentWindow(iframeUrl);
    const contentDocument = contentWindow.document;

    const containerIds = getContainerIds(contentDocument, iframeUrl);

    setContainerIds(containerIds);
  }, []);

  return containerIds;
}

// Waits for the iframes to load and checks if they have test containers.
// The iframeRefs are updated when the iframes have loaded and have at least 1 test container.
export function useWaitForIframesTestContainers(
  urls: string[],
  handleIframeLoad: (index: number) => void): React.MutableRefObject<(HTMLIFrameElement | null)[]> {
  const iframeRefs = useRef<(HTMLIFrameElement | null)[]>(Array(urls.length).fill(null));
  const intervalId = useRef<number | null>(null);

  useEffect(() => {
    if (intervalId.current !== null) {
      // If the intervalId is already set, return.
      return;
    }

    intervalId.current = window.setInterval(() => {
      let numIframesLoaded = 0;

      iframeRefs.current.forEach((iframe, index) => {
        if (iframe?.dataset.loaded) {
          numIframesLoaded++;
        }

        if (iframe && !iframe.dataset.loaded && checkIfframeHasTestContainers(iframe)) {
          iframe.dataset.loaded = "true";
          handleIframeLoad(index);
        }
      });

      // If all the iframes are loaded, clear the interval.
      if (numIframesLoaded === urls.length) {
        window.clearInterval(intervalId.current || 0);
        intervalId.current = null;
      }
    }, 100);

    return () => {
      // Clear the interval when the component is unmounted.
      clearInterval(intervalId.current || 0)
      intervalId.current = null;
    };
  }, []);

  return iframeRefs;
}

//
export const useCSS = (styleTagId: string, css?: string | null): boolean => {
  const [isStyleAdded, setIsStyleAdded] = useState(!css);

  useLayoutEffect(() => {
    if (!css) {
      return;
    }

    const styleTag = document.querySelector(`#${styleTagId}`);

    if (styleTag) {
      setIsStyleAdded(true);
      return;
    }

    const style = document.createElement('style');
    style.id = styleTagId;
    style.innerHTML = css;
    document.head.appendChild(style);

    setIsStyleAdded(true);
  }, []);

  return isStyleAdded;
}