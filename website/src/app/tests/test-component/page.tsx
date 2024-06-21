"use client"

import { Test, TestContainer, checkIfContainerTestsComplete, expect, getContainerState, getTestArray, waitFor } from "react-browser-tests";

export default function TestComponentTests() {
  return (
    <>
      <TestContainer>
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
          <TestContainer id="test-container-1" css={null}>
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
            title: "First test",
            state: "Skipped",
          });
          expect(allTests[1]).to.include({
            title: "Second test",
            state: "Skipped",
          });
          expect(allTests[2]).to.include({
            title: "Third and only test",
            state: "Success",
          });
        }}>
          <TestContainer id="test-container-2" css={null}>
            <Test title="First test" fn={() => {
              expect(1 + 1).to.equal(2);
            }} />

            <Test title="Second test" fn={() => {
              expect(1 + 1).to.equal(2);
            }} />

            <Test title="Third and only test" only fn={() => {
              expect(1 + 1).to.equal(2);
            }} />
          </TestContainer>
        </Test>
      </TestContainer >
    </>
  );
}
