"use client"

import { sidebarMenu } from "@/constants";
import { SidebarLayout, Test, TestContainer, expect, waitFor } from "react-browser-tests";

export default function ReactComponentTests() {
  return (
    <SidebarLayout sidebarMenu={sidebarMenu} activeUrl="/tests/react-components">
      <TestContainer>
        <Test title="Dummy react component test" fn={async () => {
          await waitFor(() => !!document.getElementById("dummy-component"));
          expect(document.body.innerHTML).to.contain("This is a dummy react component.");
        }}>
          <div id="dummy-component">
            <p>This is a dummy react component.</p>
          </div>
        </Test>
      </TestContainer>
    </SidebarLayout>
  );
}
