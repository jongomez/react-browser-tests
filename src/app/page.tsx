"use client"

import { TestContainer } from "@/components/TestContainer";
import { MultiplePageOverview } from "@/components/overview/MultiplePageOverview";
import { testUrls } from "@/lib/config";
import { FC } from "react";

const OverviewContent: FC = () => {
  return <div>
    <h1>reactBrowserTests</h1>

    <p>
      reactBrowserTests is a NextJS, TypeScript and browser first testing library. The main components are:
    </p>

    <ul>
      <li>&lt;TestContainer&gt; - The container for all tests. It uses react context to manage the state of the tests.</li>
      <li>&lt;TestGroup&gt; - Used to define a group of tests.</li>
      <li>&lt;Test&gt; - The actual test component.</li>
      <li>&lt;Overview&gt; - Shows an overview of all tests.</li>
    </ul>

    <p>
      These components can be used in a react app like so:
    </p>

    <pre>
      {`
<TestContainer>
  <TestGroup title="Group 1">
    <Test title="First Test" fn={() => {
    expect(1 + 1).to.equal(2);
    }} />

    <Test title="Second Test" skip fn={() => {
    expect(1 + 2).to.equal(4);
  }} />
  </TestGroup>
</TestContainer>
`}
    </pre>

    <p>The tests will automatically run when the page is loaded. Fun fact: this page you&apos;re currently looking at is a NextJS page with tests running in it.</p>
    <p>On the left side, we have a sidebar component that is automatically created in pages with &lt;TestGroup&gt; components.</p>
    <p>And down below, we have the &lt;Overview&gt; component, showing the results for each &lt;TestGroup&gt;</p>

    <h2>Running in a terminal</h2>
    <p>React Test Components provides some utilities to facilitate running tests via terminal.
      However, a headless browser (e.g. puppeteer) is still necessary.
    </p>
    <p>There is an example script availabe on github, with instructions on how to run tests from a terminal.&nbsp;
      <b>NOTE:</b> the example script uses puppeteer and tsx to run. These packages are not included in the react-test-component package. But, they can be added to a project with:</p>
    <pre>
      {`
yarn add --dev puppeteer tsx
`}
    </pre>

    <h2>Here are the test results, provided by the &lt;Overview&gt; component:</h2>
  </div>
}

export default function Home() {
  return (
    <TestContainer sidebarUrls={testUrls} >
      <OverviewContent />
      <MultiplePageOverview urls={Object.keys(testUrls)} />
    </TestContainer>
  );
}
