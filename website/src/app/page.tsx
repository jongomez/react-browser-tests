"use client"

import { Test, TestContainer, expect, waitFor } from 'react-browser-tests';
import { PrismLight as SyntaxHighlighter } from 'react-syntax-highlighter';
import bash from 'react-syntax-highlighter/dist/esm/languages/prism/bash';
import tsx from 'react-syntax-highlighter/dist/esm/languages/prism/tsx';
import prism from 'react-syntax-highlighter/dist/esm/styles/prism/prism';

SyntaxHighlighter.registerLanguage('tsx', tsx);
SyntaxHighlighter.registerLanguage('bash', bash);

export default function Home() {
  return (
    <>
      <h1>React Browser Tests</h1>

      <p>
        React Browser Tests is a browser first testing library. The tests are written in React and run in a browser. <a href="/terminal">Terminal also works</a>.
      </p>

      <p>React Browser Tests works with NextJS and TypeScript. The assertions are done with <a href="https://www.chaijs.com/">Chai.js</a>.</p>

      <SyntaxHighlighter language="bash" style={prism}>
        {`yarn add react-browser-tests`}
      </SyntaxHighlighter>

      <h2>Examples</h2>

      <p>The following example shows a NextJS page with a Test:</p>

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

      <p>We can also pass in children to the Test component along with an async test function:</p>

      <SyntaxHighlighter language="tsx" style={prism}>
        {`<Test title="Expect child component to exist." fn={async () => { 
  // Wait for the child component to be rendered.
  await waitFor(() => !!document.getElementById("child-component"));

  // Assert that the child component has the correct text content.
  expect(document.getElementById("child-component")!.textContent).to.equal("Child component.");
}}>
  <div id="child-component">Child component.</div>
</Test>`}
      </SyntaxHighlighter>

      <p>&apos;waitFor&apos; is a small utility function available in the &apos;react-browser-tests&apos; package. The result is:</p>

      <TestContainer id="test-container-2" css={null}>
        <Test title="Expect child component to exist." fn={async () => {
          // Wait for the child component to be rendered.
          await waitFor(() => !!document.getElementById("child-component"));

          // Assert that the child component has the correct text content.
          const childComponent = document.getElementById("child-component");
          expect(childComponent!.textContent).to.equal("Child component.");
        }}>
          <div id="child-component">Child component.</div>
        </Test>
      </TestContainer>

      <p>The test pages for the package contain more examples: <a href="/tests">/tests</a></p>
    </>
  );
}
