"use client"

import { ReactBrowserTestsWindowObject, Test, TestContainer, TestGroup, expect, waitFor } from "react-browser-tests";

declare global {
  interface Window extends ReactBrowserTestsWindowObject {
    containerBeforeAllRan: boolean;
    groupBeforeAllRan: boolean;
    containerBeforeEachCount: number;
    groupBeforeEachCount: number;

    groupAfterAllRan: boolean;
    groupAfterEachCount: number;
    containerAfterAllRan: boolean;
    containerAfterEachCount: number;
  }
}

export default function BeforeAndAfter() {
  return (
    <>
      <TestContainer
        beforeAll={() => {
          window.containerBeforeAllRan = true;
          window.containerBeforeEachCount = 0;
          window.groupBeforeEachCount = 0;
          window.groupBeforeAllRan = false;

          window.groupAfterAllRan = false;
          window.groupAfterEachCount = 0;
          window.containerAfterAllRan = false;
          window.containerAfterEachCount = 0;
        }}
        beforeEach={() => {
          window.containerBeforeEachCount += 1;
        }}
        afterAll={() => {
          window.containerAfterAllRan = true;
        }}
        afterEach={() => {
          window.containerAfterEachCount += 1;
        }}
      >
        <TestGroup title="Before functions 1st group"
          beforeAll={() => {
            window.groupBeforeAllRan = true;
          }}>
          <Test title="Before functions - test 1" fn={() => {
            expect(window.containerBeforeAllRan).to.be.true;
            expect(window.containerBeforeEachCount).to.equal(1);

            expect(window.groupBeforeAllRan).to.be.true;
            expect(window.groupBeforeEachCount).to.equal(0);
          }} />
        </TestGroup>

        <TestGroup title="Before functions 2nd group" beforeEach={() => {
          window.groupBeforeEachCount += 1;
        }}>
          <Test title="Before functions - test 2" fn={() => {
            expect(window.containerBeforeAllRan).to.be.true;
            // Since this is the container's second test, the beforeEach count should be 2.
            expect(window.containerBeforeEachCount).to.equal(2);

            expect(window.groupBeforeAllRan).to.be.true;
            expect(window.groupBeforeEachCount).to.equal(1);
          }} />
        </TestGroup>

        <Test title="Container beforeEach working for test with no group" fn={() => {
          // Since this is the container's third test, the beforeEach count should be 3.
          expect(window.containerBeforeEachCount).to.equal(3);
        }} />

        <TestGroup
          title="After functions group"
          afterAll={() => {
            window.groupAfterAllRan = true
          }}
          afterEach={() => {
            window.groupAfterEachCount += 1;
          }}>
          <Test title="After functions - test 1" fn={() => {
            expect(window.groupAfterEachCount).to.equal(0);
            expect(window.groupAfterAllRan).to.be.false;

            // 3 tests ran so far. So, afterEach count should be 3.
            expect(window.containerAfterEachCount).to.equal(3);
            expect(window.containerAfterAllRan).to.be.false;
          }} />
          <Test title="After functions - test 2" fn={() => {
            // Check if afterEach count is correct per the number of tests run in this group.
            expect(window.groupAfterEachCount).to.equal(1);
            expect(window.containerAfterEachCount).to.equal(4);
            expect(window.groupAfterAllRan).to.be.false;
          }} />
        </TestGroup>
      </TestContainer >

      <TestContainer id="after-all-container" css={null}>
        <Test title="Check if previous container's after functions ran" fn={async () => {
          await waitFor(() => window.containerAfterEachCount === 5);

          expect(window.containerAfterAllRan).to.be.true;
          expect(window.groupAfterAllRan).to.be.true;
        }} />
      </TestContainer>
    </>
  );
}
