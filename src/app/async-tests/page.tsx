"use client"

import { Test } from "@/components/Test";
import { TestContainer } from "@/components/TestContainer";
import { TestGroup } from "@/components/TestGroup";
import { expect } from "@/lib/chai";
import { testUrls } from "@/lib/config";

export default function AsyncTests() {
  return (
    <TestContainer sidebarUrls={testUrls}>
      <TestGroup title="Async test group">
        <Test title="Async test" fn={async () => {

          const delay = (ms: number) => new Promise(res => setTimeout(res, ms));
          await delay(1000);

          expect(1 + 1).to.equal(2);
        }} />
      </TestGroup>
    </TestContainer>
  );
}
