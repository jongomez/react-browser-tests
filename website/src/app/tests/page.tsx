"use client"

import { testUrls } from "@/constants";
import { MultiplePageOverview, TestContainer } from "react-browser-tests";

export default function Tests() {
  const urls = Object.keys(testUrls);

  return (
    <>
      <h2>Tests for the React Browser Tests package</h2>

      <p>
        These pages contain tests for the React Browser Tests package. The tests are written with the React Browser Tests package itself.
        Their source code is available on <a href="https://github.com/jongomez/react-browser-tests">github</a>.
      </p>

      <p>There are multiple pages with tests. Below, a <code>&lt;MultiplePageOverview&gt;</code> component is used to show all the test results from all the pages. The test pages can also be navigated to from the sidebar.</p>

      <TestContainer >
        <MultiplePageOverview
          urls={urls}
          iframeProps={{
            style: {
              display: "none"
            }
          }}
        />
      </TestContainer>
    </>
  );
}
