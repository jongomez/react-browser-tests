"use client"

import { Test, TestContainer, TestGroup, expect } from "react-browser-tests";


export default function AsyncTests() {
  return (
    <>
      <TestContainer>
        <TestGroup title="Async test group">
          <Test title="Async test - wait 1 second." fn={async () => {

            const delay = (ms: number) => new Promise(res => setTimeout(res, ms));
            await delay(1000);

            expect(1 + 1).to.equal(2);
          }} />

          {/* <Test title="Async test 2" fn={async () => {

            const delay = (ms: number) => new Promise(res => setTimeout(res, ms));
            await delay(1000);

            expect(1 + 1).to.equal(3);
          }} /> */}
        </TestGroup>
      </TestContainer>
    </>
  );
}
