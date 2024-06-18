"use client"

import { sidebarMenu } from '@/constants';
import { SidebarLayout, Test, TestContainer, expect, waitFor } from 'react-browser-tests';
import { PrismLight as SyntaxHighlighter } from 'react-syntax-highlighter';
import bash from 'react-syntax-highlighter/dist/esm/languages/prism/bash';
import tsx from 'react-syntax-highlighter/dist/esm/languages/prism/tsx';
import prism from 'react-syntax-highlighter/dist/esm/styles/prism/prism';

SyntaxHighlighter.registerLanguage('tsx', tsx);
SyntaxHighlighter.registerLanguage('bash', bash);

export default function Home() {
  return (
    <SidebarLayout sidebarMenu={sidebarMenu} activeUrl="/">
      <h1>React Browser Tests</h1>

      <SyntaxHighlighter language="bash" style={prism}>
        {`yarn add react-browser-tests`}
      </SyntaxHighlighter>

      <p>
        React Browser Tests is a browser first testing library. The tests are written in React and run in a browser. Terminal also works - more info down below.
      </p>

      <p>React Browser Tests works with NextJS and TypeScript. The assertions are done with <a href="https://www.chaijs.com/">Chai.js</a>.</p>

      <h2>Examples</h2>

      <p>The following example shows a NextJS page with a Test on it:</p>

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

      <p>&apos;waitFor&apos; is a small utility function imported from the &apos;react-browser-tests&apos; package. The result is:</p>

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

      <h2>Components and functions</h2>
      <p>
        This package provides the following components:
      </p>

      <ul>
        <li>&lt;TestContainer&gt; - The container for all tests. It uses react context to manage the state of the tests.</li>
        <SyntaxHighlighter language="tsx" style={prism}>
          {`// The TestContainer accepts the following optional functions:
type BeforeAndAfterFunctions = {
  beforeEach?: () => void;
  afterEach?: () => void;
  beforeAll?: (tests: TestRecord) => void
  afterAll?: (tests: TestRecord) => void;
};

// And here's the final props type:
type TestContainerProps = React.HTMLAttributes<HTMLDivElement> & BeforeAndAfterFunctions & {
  css?: string; // CSS as a string prop.
};
`}
        </SyntaxHighlighter>
        <li>&lt;Test&gt; - The actual test component.</li>
        <SyntaxHighlighter language="tsx" style={prism}>
          {`type TestProps = React.HTMLAttributes<HTMLDivElement> & {
  title: string;
  fn: TestType["fn"];
  TitleAndState?: React.FC<TitleAndStateProps>;
  skip?: boolean;
  only?: boolean;
};`}
        </SyntaxHighlighter>




        <li>&lt;TestGroup&gt; - Used to define a group of tests.</li>
        <SyntaxHighlighter language="tsx" style={prism}>
          {`// The TestGroup component also accepts the same BeforeAndAfterFunctions as the TestContainer.
// Along with a title
          type TestGroupType = BeforeAndAfterFunctions & {
  title: string;
};
`}
        </SyntaxHighlighter>
        <li>&lt;SingleTestContainersOverview&gt; - .</li>
        <li>&lt;MultipleTestContainersOverview&gt; - .</li>
        <li>&lt;MultiplePageOverview&gt; - Shows an overview of all tests.</li>
        <li>&lt;SidebarLayout&gt; - A layout with a sidebar.</li>
        <li>&lt;TestGroupStats&gt; - .</li>
        <li>&lt;TestStatsDisplay&gt; - .</li>
      </ul>

      <p>The package also provides the following functions:</p>

      <ul>
        <li>waitFor - </li>
        <li>assert, expect, should - These are re-exported from <a href="https://www.chaijs.com/">Chai.js</a>.</li>
      </ul>

      <p>The testHelpers.ts and hooks.ts files have additional functions that are exported. However, the main functions are the ones listed above.</p>

      <h2>Running in a terminal</h2>
      <p>React Test Components provides some utilities to facilitate running tests via terminal.
        However, a headless browser (e.g. puppeteer) is still necessary.
      </p>
      <p>There is an example script availabe on github, with instructions on how to run tests from a terminal.&nbsp;
        <b>NOTE:</b> the example script uses puppeteer and tsx to run. These packages are not included in the react-test-component package. But, they can be added to a project with:</p>
      <pre>
        <SyntaxHighlighter language="bash" style={prism}>
          {`yarn add --dev puppeteer tsx`}
        </SyntaxHighlighter>
      </pre>
    </SidebarLayout>
  );
}
