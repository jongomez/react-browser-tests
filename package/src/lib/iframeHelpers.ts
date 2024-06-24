import { TestState, TestType } from "../types";
import { toValidDOMId } from "./testHelpers";

let hasExecuteTestListener = false;
let hasRegisterTestListener = false;

export function isIframeLoaded(iframe: HTMLIFrameElement): boolean {
  try {
    // Check if the iframe's document is accessible and complete
    const doc = iframe.contentDocument || iframe.contentWindow?.document;
    return doc?.readyState === 'complete';
  } catch (error) {
    // Likely a security error if the iframe is from a different origin
    console.error("Unable to access iframe's document:", error);
    return false;
  }
}

export function insideIframePathString(): string {
  const topWindowPath = window.top?.location.pathname;
  const currentWindowPath = window.location.pathname;

  if (topWindowPath === currentWindowPath) {
    return "";
  }

  return "Iframe " + currentWindowPath + " - ";
}

export function checkIfframeHasTestContainers(iframe: HTMLIFrameElement): boolean {
  const iframeWindow = iframe.contentWindow;
  if (!iframeWindow) {
    return false;
  }

  return iframeWindow.reactBrowserTests?.testContainers?.length > 0;
}

function waitForIframeLoad(iframe: HTMLIFrameElement, timeout: number = 5000): Promise<void> {
  return new Promise((resolve, reject) => {
    // Set up a timer to reject the promise if the iframe takes too long to load
    const timeoutId = setTimeout(() => {
      iframe.onload = null;  // Clean up the onload event handler
      throw new Error(`Loading timeout exceeded for iframe with ID ${iframe.id}`);
    }, timeout);

    iframe.onload = () => {
      clearTimeout(timeoutId);
      resolve();
    };

    iframe.onerror = () => {
      clearTimeout(timeoutId);
      throw new Error(`Failed to load the iframe with ID ${iframe.id}`);
    };
  });
}

export async function getIframeWindowAndDocument(testID: string): Promise<[Window, Document]> {
  let iframeId = toValidDOMId(testID) + "-frame";
  let iframe = document.getElementById(iframeId) as HTMLIFrameElement;

  if (!iframe) {
    throw new Error(`Failed to find iframe with ID ${iframeId}`);
  }

  if (!isIframeLoaded(iframe)) {
    await waitForIframeLoad(iframe);
  }

  const iframeWindow = iframe.contentWindow;
  const iframeDocument = iframe.contentDocument;

  if (!iframeWindow) {
    throw new Error(`Failed to get the content window for iframe with ID ${iframe.id}`);
  }

  if (!iframeDocument) {
    throw new Error(`Failed to get the content document for iframe with ID ${iframe.id}`);
  }

  return [iframeWindow, iframeDocument];
}

export async function awaitIframeTestResult(iframeContentWindow: Window, testFn: Function): Promise<any> {
  return new Promise((resolve, reject) => {
    const messageHandler = (event: MessageEvent) => {

      console.log('Received message from iframe:', event.data);

      if (event.data.type === 'testResult') {
        // XXX: Test has completed. Here, we resolve the promise with the result.
        window.removeEventListener('message', messageHandler);
        resolve(event.data.result);
      }
    };

    window.addEventListener('message', messageHandler);

    // Timeout to reject the promise if no response is received within a certain timeframe
    setTimeout(() => {
      window.removeEventListener('message', messageHandler);
      reject(new Error('Test timed out'));
    }, 5000); // TODO: Make this configurable

    // Post a message to the iframe to execute the test
    iframeContentWindow.postMessage({
      type: 'executeTest'
    }, '*');
  });
}

function postMessage(type: string, result: TestState) {
  window.parent.postMessage({ type, result }, '*');
}

export function addExecuteTestListener(testFn: TestType["fn"]) {
  if (hasExecuteTestListener) {
    return;
  }

  window.addEventListener("message", (event) => {
    if (event.data.type === "executeTest") {
      try {
        // XXX: Iframe test function execution happens here.
        const testResult = testFn(window, document)

        if (testResult instanceof Promise) {
          testResult.then(result => {
            postMessage("testResult", "Success");
          });
        } else {
          postMessage("testResult", "Success");
        }

      } catch (error) {
        postMessage("testResult", "Fail");
      }
    }
  });

  hasExecuteTestListener = true;
}

export function addRegisterTestListener() {
  if (hasRegisterTestListener) {
    return;
  }

  window.addEventListener("message", (event) => {
    if (event.data.type === "registerTest") {
      console.log("registering test from parent:", event.data);

      const test = event.data.test;
      addExecuteTestListener(test.fn);
    }
  });

  hasRegisterTestListener = true;
}

export function registerIframeTest(test: TestType) {
  window.parent.postMessage({ type: "registerTest", test }, '*');
}
