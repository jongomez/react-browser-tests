"use client"

import { Test, TestContainer, expect } from 'react-browser-tests';
import { PrismLight as SyntaxHighlighter } from 'react-syntax-highlighter';
import bash from 'react-syntax-highlighter/dist/esm/languages/prism/bash';
import tsx from 'react-syntax-highlighter/dist/esm/languages/prism/tsx';
import prism from 'react-syntax-highlighter/dist/esm/styles/prism/prism';

SyntaxHighlighter.registerLanguage('tsx', tsx);
SyntaxHighlighter.registerLanguage('bash', bash);

export default function TestContainerPage() {
  return (
    <>
      <h1>&lt;TestContainer&gt;</h1>

      <p>Container of &lt;Test&gt; components. Uses react context to manage the state of the tests.</p>
      <p>&lt;Test&gt; components must have a &lt;TestContainer&gt; parent somewhere in the tree.</p>

      <h3>Example in a NextJS page:</h3>

      <SyntaxHighlighter language="tsx" style={prism}>
        {`import { Test, TestContainer, TestGroup, expect } from "react-browser-tests";

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
          beforeEach?
        </div>
        <div>
          <p>Function that runs before each test in the container.</p>
        </div>
        <div>
          afterEach?
        </div>
        <div>
          <p>Function that runs after each test in the container.</p>
        </div>
        <div>
          beforeAll?
        </div>
        <div>
          <p>Function that runs before all tests in the container.</p>
        </div>
        <div>
          afterAll?
        </div>
        <div>
          <p>Function that runs after all tests in the container.</p>
        </div>
        <div>
          css?
        </div>
        <div>
          <p>CSS styles to apply to the container&apos;s elements. The default value is a CSS string constant called <code>testContainerStyles</code>, exported from the <code>styles.ts</code> file.</p>
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
