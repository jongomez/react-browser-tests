"use client"

import { Test } from "@/components/Test";
import { TestContainer } from "@/components/TestContainer";
import { TestGroup } from "@/components/TestGroup";
import { MultiplePageOverview } from "@/components/overview/MultiplePageOverview";
import { MultipleTestContainersOverview } from "@/components/overview/MultipleTestContainersOverview";
import { SingleTestContainerOverview } from "@/components/overview/SingleTestContainerOverview";
import { testUrls } from "@/lib/config";
import { waitFor } from "@/lib/testHelpers";
import { expect } from "chai";

export default function OverviewComponentsTests() {
  return (
    <>
      <TestContainer id="first-container" sidebarUrls={testUrls} >
        <Test title="Single test container overview" fn={async () => {
          await waitFor(() => !!document.getElementById("overview-1"));
          expect(document.body.innerHTML).to.contain("passed: 0");
          expect(document.body.innerHTML).to.contain("failed: 0");
        }}>
          <SingleTestContainerOverview id="overview-1" containerId="first-container" />
        </Test>
      </TestContainer >

      <TestContainer id="second-container">
        <TestGroup title="Test group">
          <Test title="Multiple test containers overview" fn={async () => {
            await waitFor(() => !!document.getElementById("overview-1"));
            // Wait for the prev. test to pass.
            await waitFor(() => document.body.innerHTML.includes("passed: 1"));

            // The prev. test passed, but the current container's tests haven't run yet. 
            expect(document.body.innerHTML).to.contain("passed: 0");
          }}>
            <MultipleTestContainersOverview id="multiple-overview-1" />
          </Test>
        </TestGroup>

        <Test title="Multiple page overview test" fn={async () => {
          await waitFor(() => !!document.body.innerHTML.includes("Results for url /async-tests"));
          await waitFor(() => !!document.body.innerHTML.includes("Results for url /test-component"));
          await waitFor(() => !!document.body.innerHTML.includes("passed: 1"));
          await waitFor(() => !!document.body.innerHTML.includes("passed: 2"));
        }}>
          <MultiplePageOverview urls={["/async-tests", "/test-component"]} />
        </Test>
      </TestContainer>
    </>
  );
}
