"use client"

import { sidebarMenu } from "@/constants";
import { MultiplePageOverview, MultipleTestContainersOverview, SidebarLayout, Test, TestContainer, TestGroup, expect, waitFor } from "react-browser-tests";

export default function OverviewComponentsTests() {
  return (
    <SidebarLayout sidebarMenu={sidebarMenu} activeUrl="/tests/overview-components">
      <TestContainer id="first-container">
        <Test title="Simple passing test: 1 + 1 = 2" fn={async () => {
          expect(1 + 1).to.equal(2);
        }} />
      </TestContainer >

      <TestContainer id="second-container" css={null}>
        <TestGroup title="Multiple test containers group">
          <Test title="Multiple test containers overview" fn={async () => {
            await waitFor(() => !!document.getElementById("multiple-container-overview-1"));
            const multiContainerOverview = document.getElementById("multiple-container-overview-1") as HTMLDivElement;

            // In this page, there should be only one test that passed so far (the one above). 
            await waitFor(() => multiContainerOverview.querySelector('[data-test-count="success"]')?.innerHTML === "1")
          }}>
            <MultipleTestContainersOverview id="multiple-container-overview-1" />
          </Test>
        </TestGroup>

        <Test title="Multiple page overview test" fn={async () => {
          await waitFor(() => !!document.getElementById("multiple-page-overview"));
          const multiPageOverview = document.getElementById("multiple-page-overview") as HTMLIFrameElement;

          await waitFor(() => !!multiPageOverview.innerHTML.includes("Url '/tests/async-tests'"));
          await waitFor(() => !!multiPageOverview.innerHTML.includes("Url '/tests/test-component'"));

          // querySelector only returns the first element - but, it'll do for now.
          await waitFor(() => multiPageOverview.querySelector('[data-test-count="fail"]')?.innerHTML === '0')
        }}>
          <MultiplePageOverview
            urls={["/tests/async-tests", "/tests/test-component"]}
            iframeProps={{
              style: {
                display: "none"
              }
            }}
            id="multiple-page-overview"
          />
        </Test>
      </TestContainer>
    </SidebarLayout>
  );
}
