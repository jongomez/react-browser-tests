"use client"

import { PrismLight as SyntaxHighlighter } from 'react-syntax-highlighter';
import bash from 'react-syntax-highlighter/dist/esm/languages/prism/bash';
import tsx from 'react-syntax-highlighter/dist/esm/languages/prism/tsx';
import prism from 'react-syntax-highlighter/dist/esm/styles/prism/prism';

SyntaxHighlighter.registerLanguage('tsx', tsx);
SyntaxHighlighter.registerLanguage('bash', bash);

export default function HelperFunctionsPage() {
  return (
    <>
      <h2>Helper Functions</h2>

      <p>React Browser Tests exports multiple functions and hooks that can be used in tests. The main ones are:</p>

      <div className="grid-container">
        <div>waitFor</div>
        <div>
          <p>Waits for a condition to be true. Receives a function that returns a boolean. Returns a promise that resolves when the function returns true, or rejects after a timeout.</p>
        </div>

        <div>getTestArrayFromContainerState</div>
        <div>
          <p>Receives a containerState object and returns the array of tests from it.</p>
        </div>

        <div>groupTests</div>
        <div>
          <p>Receives an array of tests and a group name. Returns an array with only the tests with the passed in group name.</p>
        </div>

        <div>assert, expect, should</div>
        <div>
          <p>These are re-exported from <a href="https://www.chaijs.com/">Chai</a>.</p>
        </div>
      </div>

      <h3>window.reactBrowserTests</h3>
      <p>The global window object has multiple functions available. They can be accessed through the <code>window.reactBrowserTests</code> object. The type of this object is:</p>

      <SyntaxHighlighter language="tsx" style={prism}>
        {`type ReactBrowserTestsWindowObject = {
  testContainers: TestContainerState[];
  getContainerState: (containerId?: string, windowRef?: Window) => TestContainerState | undefined;
  getTestRecord: (containerId?: string, windowRef?: Window) => Record<string, TestType>;
  getTestArray: (containerId?: string, windowRef?: Window) => TestType[];
  checkIfContainerTestsComplete: (containerId?: string, windowRef?: Window) => boolean;
  checkIfTestsFromAllContainersComplete: (windowRef?: Window) => boolean;
  sumTotalNumberOfTests: (windowRef?: Window) => number | null;
  checkIfAllTestsRegistered: (windowRef?: Window) => boolean;
}`}
      </SyntaxHighlighter>

      <p>Here&apos;s an example of how to fetch an array with all the tests:</p>

      <SyntaxHighlighter language="tsx" style={prism}>
        {`const testArray = window.reactBrowserTests.getTestArray();`}
      </SyntaxHighlighter>

      <h3>Others</h3>
      <p>There are other functions available. Their source code is available on:</p>
      <ul>
        <li>testHelpers.ts</li>
        <li>window.ts</li>
        <li>hooks.ts</li>
        <li>iframeHelpers.ts</li>
      </ul>
    </>
  );
}
