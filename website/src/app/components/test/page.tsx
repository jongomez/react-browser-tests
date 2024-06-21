"use client"

import { StatesMeaning } from '@/components/StatesMeaning';
import { Test, TestContainer, expect } from 'react-browser-tests';
import { PrismLight as SyntaxHighlighter } from 'react-syntax-highlighter';
import bash from 'react-syntax-highlighter/dist/esm/languages/prism/bash';
import tsx from 'react-syntax-highlighter/dist/esm/languages/prism/tsx';
import prism from 'react-syntax-highlighter/dist/esm/styles/prism/prism';

SyntaxHighlighter.registerLanguage('tsx', tsx);
SyntaxHighlighter.registerLanguage('bash', bash);

export default function TestPage() {
  return (
    <>
      <h1>&lt;Test&gt;</h1>

      <p>Executes a test function and shows the result in a browser. Optionally, the tests can run in a terminal, via a headless browser for example.</p>
      <p>The tests in a &lt;TestContainer&gt; run sequentially. The child components of each &lt;Test&gt; component are only rendered when the test is running or has run.</p>
      <p>&lt;Test&gt; components must have a &lt;TestContainer&gt; parent somewhere in the tree.</p>

      <StatesMeaning />

      <h3>Example in a NextJS page:</h3>

      <SyntaxHighlighter language="tsx" style={prism}>
        {`import { Test, TestContainer, expect } from "react-browser-tests";

export default function TestPage() {
  return (
    <TestContainer>
        <Test title="Expect 1 + 1 to equal 2." fn={() => {
          expect(1 + 1).to.equal(2);
        }} />
    </TestContainer>
  );
}`}
      </SyntaxHighlighter>

      <p>If we navigate to that page, we&apos;ll see:</p>

      <TestContainer>
        <Test title="Expect 1 + 1 to equal 2." fn={() => {
          expect(1 + 1).to.equal(2);
        }} />
      </TestContainer>

      <h3>Props</h3>
      <div className="grid-container">
        <div>
          title
        </div>
        <div>
          <p>Title of the test.</p>
        </div>
        <div>
          fn
        </div>
        <div>
          <p>Test function where the test is written. Can be async.</p>
        </div>
        <div>
          TitleAndState?
        </div>
        <div>
          <p>React component that shows the state and title of the test. If no component is passed in, the default component is used: &lt;TitleAndStateDefault&gt;. The props for this component are: test title and state.</p>
        </div>
        <div>
          skip?
        </div>
        <div>
          <p>Boolean - skips the test if set to true.</p>
        </div>
        <div>
          only?
        </div>
        <div>
          <p>Boolean - only runs this test if set to true.</p>
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
