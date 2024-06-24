"use client"

import { MultiplePageOverview, TestContainer } from "react-browser-tests";
import { PrismLight as SyntaxHighlighter } from 'react-syntax-highlighter';
import bash from 'react-syntax-highlighter/dist/esm/languages/prism/bash';
import tsx from 'react-syntax-highlighter/dist/esm/languages/prism/tsx';
import prism from 'react-syntax-highlighter/dist/esm/styles/prism/prism';

SyntaxHighlighter.registerLanguage('tsx', tsx);
SyntaxHighlighter.registerLanguage('bash', bash);

export default function MultiplePageOverviewPage() {
  return (
    <>
      <h1>&lt;MultiplePageOverview&gt;</h1>

      <p>Receives an array of URLs and shows an overview of all the tests in all the pages.</p>
      <p>This component creates an iframe for each of the passed in URLs. Then, for each iframe, a &lt;MultipleTestContainersOverview&gt; component is used to show an overview of the tests. </p>
      <p>Currently, a &lt;TestContainer&gt; parent element is required (just for the CSS styles. This may change in the future).</p>

      <h3>Example:</h3>

      <p>In the following example, a &lt;MultiplePageOverview&gt; component is used to show all the test results from the urls <a href="/tests/async-tests">/tests/async-tests</a> and <a href="/tests/test-component">/tests/test-component</a>. The test pages can also be navigated to from the sidebar.</p>

      <SyntaxHighlighter language="tsx" style={prism}>
        {`<TestContainer>
  <MultiplePageOverview
    urls={["/tests/async-tests", "/tests/test-component"]}
    iframeProps={{
      style: {
        display: "none"
      }
    }}
  />
</TestContainer>
`}
      </SyntaxHighlighter>

      <p>And the result is:</p>

      <TestContainer>
        <MultiplePageOverview
          urls={["/tests/async-tests", "/tests/test-component"]}
          iframeProps={{
            style: {
              display: "none"
            }
          }}
        />
      </TestContainer>

      <h3>Props</h3>
      <div className="grid-container">
        <div>
          urls
        </div>
        <div>
          <p>Array of strings - URLs of the test pages.</p>
        </div>

        <div>
          iframeProps?
        </div>
        <div>
          <p>Object with props for the iframe element. Example usage:</p>
          <SyntaxHighlighter language="tsx" style={prism}>
            {`<MultiplePageOverview iframeProps={{ style: { display: "none" } }} />`}
          </SyntaxHighlighter>
        </div>

        <div>
          singleIframeMode?
        </div>
        <div>
          <p>Boolean - if true, only one iframe is shown at a time. The default is false.</p>
          <p>Setting this to true will very likely slow down the tests because the tests will run sequentially instead of in parallel.</p>
          <p>However, in certain situations this may be necessary - for example, there&apos;s a limit on the amount of webgl contexts that can be created at the same time. If multiple iframes try to create a webgl context at the same time, the tests may fail.</p>
        </div>

        <div>
          HTMLDivElement props
        </div>
        <div>
          <p>Supports standard HTMLDivElement props. For example: <code>className</code>, <code>style</code>, etc.</p>
        </div>
      </div>
    </>
  );
}
