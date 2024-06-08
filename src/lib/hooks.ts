import { useEffect, useRef, useState } from "react";
import { base64TestIdUrlParam, defaultContainerId } from "./constants";
import { getContainerIds } from "./testHelpers";
import { TestContainerState } from "./types";
import { checkIfContainerTestsComplete, getContainerState, updateWindowObject } from "./window";

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
    debugger
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

export const getContentWindow = (iframeUrl?: string): Window => {
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
  const didUnmount = useRef<boolean>(false);

  useEffect(() => {
    if (intervalId.current !== null) {
      // If the intervalId is already set, return.
      return;
    }

    const updateContainerState = () => {
      try {
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

    const containerIds = getContainerIds(contentDocument);

    setContainerIds(containerIds);
  }, []);

  return containerIds;
}