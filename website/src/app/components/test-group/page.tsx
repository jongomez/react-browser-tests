"use client"

import { Test, TestContainer, TestGroup, expect } from 'react-browser-tests';
import { PrismLight as SyntaxHighlighter } from 'react-syntax-highlighter';
import bash from 'react-syntax-highlighter/dist/esm/languages/prism/bash';
import tsx from 'react-syntax-highlighter/dist/esm/languages/prism/tsx';
import prism from 'react-syntax-highlighter/dist/esm/styles/prism/prism';

SyntaxHighlighter.registerLanguage('tsx', tsx);
SyntaxHighlighter.registerLanguage('bash', bash);

export default function TestGroupPage() {
  return (
    <>
      <h1>&lt;TestGroup&gt;</h1>

      <p>Groups multiple &lt;Test&gt; components together. &lt;Test&gt; components can be used without a &lt;TestGroup&gt; parent.</p>

      <p>Currently, the main uses for this component are:</p>

      <ol>
        <li>Providing before and after functions for a group of tests.</li>
        <li>Organizing the tests results shown in a terminal.</li>
        <li>The overview components can show stats for test groups.</li>
      </ol>

      <h3>Example in a NextJS page:</h3>

      <SyntaxHighlighter language="tsx" style={prism}>
        {`import { Test, TestContainer, TestGroup, expect } from "react-browser-tests";

export default function TestPage() {
  return (
    <TestContainer>
      <TestGroup title="Math tests">
        <Test title="Expect 1 + 1 to equal 2." fn={() => {
          expect(1 + 1).to.equal(2);
        }} />
      </TestGroup>
    </TestContainer>
  );
}`}
      </SyntaxHighlighter>

      <p>If we navigate to that page, we&apos;ll see the following:</p>

      <TestContainer>
        <TestGroup title="Math tests">
          <Test title="Expect 1 + 1 to equal 2." fn={() => {
            expect(1 + 1).to.equal(2);
          }} />
        </TestGroup>
      </TestContainer>

      <h3>Props</h3>

      <div className="grid-container">
        <div>
          title
        </div>
        <div>
          <p>Test group title.</p>
        </div>
        <div>
          beforeEach?
        </div>
        <div>
          <p>Function that runs before each test in the test group.</p>
        </div>
        <div>
          afterEach?
        </div>
        <div>
          <p>Function that runs after each test in the test group.</p>
        </div>
        <div>
          beforeAll?
        </div>
        <div>
          <p>Function that runs before all tests in the test group.</p>
        </div>
        <div>
          afterAll?
        </div>
        <div>
          <p>Function that runs after all tests in the test group.</p>
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
