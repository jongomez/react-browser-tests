"use client"

import { TestContainer, TestStatsDisplay } from 'react-browser-tests';
import { PrismLight as SyntaxHighlighter } from 'react-syntax-highlighter';
import bash from 'react-syntax-highlighter/dist/esm/languages/prism/bash';
import tsx from 'react-syntax-highlighter/dist/esm/languages/prism/tsx';
import prism from 'react-syntax-highlighter/dist/esm/styles/prism/prism';

SyntaxHighlighter.registerLanguage('tsx', tsx);
SyntaxHighlighter.registerLanguage('bash', bash);

export default function Components() {
  return (
    <>
      <h2>Components</h2>
      <p>
        The main components provided by the React Browser Tests package are:
      </p>

      <div className="grid-container">
        <div>&lt;TestContainer&gt;</div>
        <div>
          <p>Container of &lt;Test&gt; components. Uses react context to manage the state of the tests.</p>
          <p>&lt;Test&gt; components must have a &lt;TestContainer&gt; parent somewhere in the tree.</p>
        </div>

        <div>&lt;Test&gt;</div>
        <div>
          <p>Executes a test function and shows the result in a browser. Optionally, the tests can run in a terminal, via a headless browser for example.</p>
          <p>The tests in a &lt;TestContainer&gt; run sequentially. The child components of each &lt;Test&gt; component are only rendered when the test is running or has run.</p>
          <p>&lt;Test&gt; components must have a &lt;TestContainer&gt; parent somewhere in the tree.</p>
        </div>

        <div>&lt;TestGroup&gt;</div>
        <div>
          <p>Groups multiple &lt;Test&gt; components together. &lt;Test&gt; components can be used without a &lt;TestGroup&gt; parent.</p>
        </div>

        <div>&lt;SingleTestContainersOverview&gt;</div>
        <div><p>Shows an overview of all the tests in a single &lt;TestContainer&gt; element.</p></div>

        <div>&lt;MultipleTestContainersOverview&gt;</div>
        <div>
          <p>Shows an overview of all the tests in all &lt;TestContainer&gt; elements in a single page.</p>
          <p><b>Note:</b> having multiple &lt;TestContainer&gt; elements in a page is possible, but it will significantly increase complexity, and may not be working 100% correctly.</p>
        </div>

        <div>&lt;MultiplePageOverview&gt;</div>
        <div>
          <p>Receives an array of URLs and shows an overview of all the tests in all the pages.</p>
          <p>This component creates an iframe for each of the passed in URLs. Then, for each iframe, a &lt;MultipleTestContainersOverview&gt; component is used to show an overview of the tests. </p>
          <p>Currently, a &lt;TestContainer&gt; parent element is required (just for the CSS styles. This may change in the future).</p>
        </div>

        <div>&lt;SidebarLayout&gt;</div>
        <div>
          <p>Simple sidebar layout UI component. Contains a sidebar with links, a header and a main content area. Useful when handling multiple test pages.</p>
          <p>The sidebar and header in this website were built using a &lt;SidebarLayout&gt; component.</p>
        </div>
      </div>

      <h3>Secondary components</h3>
      <p>The following are secondary components. They are used internally by the main components listed above, but are also exported as they may potentially be useful:</p>
      <div className="grid-container">
        <div>&lt;TestStatsDisplay&gt;</div>
        <div>
          <p>Receives an object with test stats, and shows the results. Example usage:</p>
          <SyntaxHighlighter language="tsx" style={prism}>
            {`<TestContainer>
  <TestStatsDisplay
    testStats={{
      total: 3,
      passed: 2,
      failed: 0,
      skipped: 1,
      pending: 0,
      running: 0,
      state: "Success"
  }} />
</TestContainer>`}
          </SyntaxHighlighter>

          <p>Final result:</p>
          <TestContainer>
            <TestStatsDisplay
              testStats={{
                total: 3,
                passed: 2,
                failed: 0,
                skipped: 1,
                pending: 0,
                running: 0,
                state: "Success"
              }} />
          </TestContainer>
        </div>
        <div>&lt;TestArrayStats&gt;</div>
        <div><p>Receives a groupTitle and an array of tests. This component will render a &lt;TestStatsDisplay&gt; component with stats for all the tests in the passed in array.</p></div>
      </div>
    </>
  );
}
