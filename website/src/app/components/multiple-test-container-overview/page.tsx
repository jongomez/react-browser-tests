"use client"

import { MultipleTestContainersOverview, Test, TestContainer, expect } from "react-browser-tests";
import { PrismLight as SyntaxHighlighter } from 'react-syntax-highlighter';
import bash from 'react-syntax-highlighter/dist/esm/languages/prism/bash';
import tsx from 'react-syntax-highlighter/dist/esm/languages/prism/tsx';
import prism from 'react-syntax-highlighter/dist/esm/styles/prism/prism';

SyntaxHighlighter.registerLanguage('tsx', tsx);
SyntaxHighlighter.registerLanguage('bash', bash);

export default function MultipleTestContainersOverviewPage() {
  return (
    <>
      <h1>&lt;MultipleTestContainersOverview&gt;</h1>

      <p><b>Note:</b> having multiple &lt;TestContainer&gt; elements in a page is possible, but it will significantly increase complexity, and may not be working 100% correctly.</p>
      <p>Shows an overview of all the tests in all &lt;TestContainer&gt; elements in a single page.</p>

      <h3>Example with 2 &lt;TestContainer&gt;&apos;s in a NextJS page:</h3>

      <SyntaxHighlighter language="tsx" style={prism}>
        {`import { Test, TestContainer, expect, MultipleTestContainersOverview } from "react-browser-tests";

export default function Page() {
  return (
    <>
      <TestContainer>
        <Test style={{display: "none"}} title="Simple passing test: 1 + 1 = 2" fn={async () => {
          expect(1 + 1).to.equal(2);
        }} />
      </TestContainer >

      <TestContainer id="failing-container">
        <Test style={{display: "none"}} title="Simple failing test: 1 + 1 = 3" fn={async () => {
          expect(1 + 1).to.equal(3);
        }} />
      </TestContainer >

      <MultipleTestContainersOverview />
    </>
  );
}
`}
      </SyntaxHighlighter>

      <p>Note that in the code above, the tests have <code>display: none</code>. This way, only the &lt;MultipleTestContainersOverview&gt; component will be visible. The final result is:</p>

      <>
        <TestContainer>
          <Test style={{ display: "none" }} title="Simple passing test: 1 + 1 = 2" fn={async () => {
            expect(1 + 1).to.equal(2);
          }} />
        </TestContainer >

        <TestContainer id="failing-container">
          <Test style={{ display: "none" }} title="Simple failing test: 1 + 1 = 3" fn={async () => {
            expect(1 + 1).to.equal(3);
          }} />
        </TestContainer >

        <MultipleTestContainersOverview />
      </>

      <h3>Props</h3>
      <div className="grid-container">
        <div>
          iframeUrl?
        </div>
        <div>
          <p>String - if the current page has an iframe, and we wish to show an overview for the tests in that iframe, we can pass in the iframe&apos;s url here.</p>
        </div>

        <div>
          showGroupStats?
        </div>
        <div>
          <p>Boolean - whether or not to show &lt;TestGroup&gt; information. Default is false.</p>
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
