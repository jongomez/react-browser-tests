"use client"

import { StatesMeaning } from "@/components/StatesMeaning";
import { SingleTestContainerOverview, Test, TestContainer, expect } from "react-browser-tests";
import { PrismLight as SyntaxHighlighter } from 'react-syntax-highlighter';
import bash from 'react-syntax-highlighter/dist/esm/languages/prism/bash';
import tsx from 'react-syntax-highlighter/dist/esm/languages/prism/tsx';
import prism from 'react-syntax-highlighter/dist/esm/styles/prism/prism';

SyntaxHighlighter.registerLanguage('tsx', tsx);
SyntaxHighlighter.registerLanguage('bash', bash);

export default function SingleTestContainerOverviewPage() {
  return (
    <>
      <h1>&lt;SingleTestContainerOverview&gt;</h1>

      <p>Shows an overview of all the tests in a single &lt;TestContainer&gt; element.</p>
      <StatesMeaning />

      <h3>Example in a NextJS page:</h3>

      <SyntaxHighlighter language="tsx" style={prism}>
        {`import { Test, TestContainer, expect, SingleTestContainerOverview } from "react-browser-tests";

export default function Page() {
  return (
    <>
      <TestContainer>
        <Test style={{display: "none"}} title="Simple passing test: 1 + 1 = 2" fn={async () => {
          expect(1 + 1).to.equal(2);
        }} />

        <Test style={{display: "none"}} title="Simple failing test: 1 + 1 = 3" fn={async () => {
          expect(1 + 1).to.equal(3);
        }} />
      </TestContainer >

      <SingleTestContainerOverview title="1 success and 1 fail. Final state: fail."/>
    </>
  );
}
`}
      </SyntaxHighlighter>

      <p>Note that in the code above, the tests have display: none. This way, only the &lt;SingleTestContainerOverview&gt; component will be visible. The final result is:</p>

      <>
        <TestContainer>
          <Test style={{ display: "none" }} title="Simple passing test: 1 + 1 = 2" fn={async () => {
            expect(1 + 1).to.equal(2);
          }} />

          <Test style={{ display: "none" }} title="Simple failing test: 1 + 1 = 3" fn={async () => {
            expect(1 + 1).to.equal(3);
          }} />
        </TestContainer >

        <SingleTestContainerOverview title="1 success and 1 fail. Final state: fail." />
      </>

      <h3>Props</h3>
      <div className="grid-container">
        <div>
          containerId?
        </div>
        <div>
          <p>The Id of the &lt;TestContainer&gt; we wish to show an overview of. If not passed in, the default containerId is used: &quot;test-container&quot;</p>
        </div>

        <div>
          title?
        </div>
        <div>
          <p>String - text to show next to the overview icons.</p>
        </div>

        <div>
          showGroupStats?
        </div>
        <div>
          <p>Boolean - whether or not to show &lt;TestGroup&gt; information. Default is false.</p>
        </div>

        <div>
          iframeUrl?
        </div>
        <div>
          <p>String - if the current page has an iframe, and we wish to show an overview for the tests in that iframe, we can pass in the iframe&apos;s url here.</p>
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
