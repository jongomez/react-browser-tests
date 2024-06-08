"use client"

import { Test } from "@/components/Test";
import { TestContainer } from "@/components/TestContainer";
import { expect } from "@/lib/chai";
import { testUrls } from "@/lib/config";
import { waitFor } from "@/lib/testHelpers";
import { checkIfContainerTestsComplete, getContainerState, getTestArray } from "@/lib/window";

export default function TestComponentTests() {
  return (
    <TestContainer sidebarUrls={testUrls}>
      <Test title="Skip is working" fn={async () => {
        const containerId = "test-container-1"
        await waitFor(() => checkIfContainerTestsComplete(containerId));
        const allTests = getTestArray(containerId)
        const containerState = getContainerState(containerId);
        const numberOfTests = 2;

        expect(containerState).to.deep.include({
          totalNumberOfTests: numberOfTests,
          groupRecord: {},
        });
        expect(allTests).to.have.length(numberOfTests);
        expect(allTests[0]).to.include({
          title: "Non skip test",
          state: "Success",
        });
        expect(allTests[1]).to.include({
          title: "Skip test",
          state: "Skipped",
        });
      }}>
        <TestContainer Sidebar={null} id="test-container-1">
          <Test title="Non skip test" fn={() => {
            expect(1 + 1).to.equal(2);
          }} />

          <Test title="Skip test" skip fn={() => {
            expect(1 + 1).to.equal(2);
          }} />
        </TestContainer>
      </Test>

      <Test title="Only is working" fn={async () => {
        // Wait until the window's allTestsComplete is true.
        const containerId = "test-container-2"
        await waitFor(() => checkIfContainerTestsComplete(containerId));
        const allTests = getTestArray(containerId);
        const containerState = getContainerState(containerId);
        const numberOfTests = 3;

        expect(containerState).to.deep.include({
          totalNumberOfTests: numberOfTests,
          groupRecord: {},
        });
        expect(allTests).to.have.length(numberOfTests);
        expect(allTests[0]).to.include({
          title: "First Test",
          state: "Skipped",
        });
        expect(allTests[1]).to.include({
          title: "Second Test",
          state: "Skipped",
        });
        expect(allTests[2]).to.include({
          title: "Third Test",
          state: "Success",
        });
      }}>
        <TestContainer Sidebar={null} id="test-container-2">
          <Test title="First Test" fn={() => {
            expect(1 + 1).to.equal(2);
          }} />

          <Test title="Second Test" fn={() => {
            expect(1 + 1).to.equal(2);
          }} />

          <Test title="Third Test" only fn={() => {
            expect(1 + 1).to.equal(2);
          }} />
        </TestContainer>
      </Test>
    </TestContainer >
  );
}
