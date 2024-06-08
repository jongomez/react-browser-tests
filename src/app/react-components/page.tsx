"use client"

import { Test } from "@/components/Test";
import { TestContainer } from "@/components/TestContainer";
import { expect } from "@/lib/chai";
import { testUrls } from "@/lib/config";
import { waitFor } from "@/lib/testHelpers";

export default function ReactComponentTests() {
  return (
    <TestContainer sidebarUrls={testUrls}>
      <Test title="Dummy react component test" fn={async () => {
        await waitFor(() => !!document.getElementById("dummy-component"));
        expect(document.body.innerHTML).to.contain("This is a dummy component");
      }}>
        <div id="dummy-component">
          <h1>This is a dummy component</h1>
        </div>
      </Test>
    </TestContainer>
  );
}
