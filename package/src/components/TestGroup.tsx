import { FC, useEffect, useRef } from "react";
import { toValidDOMId } from "../lib/testHelpers";
import { TestGroupType } from "../types";
import { useTestContext } from "./TestContext";
import { TestGroupProvider } from "./TestGroupContext";

export type TestGroupProps = React.HTMLAttributes<HTMLDivElement> & TestGroupType & {
  children: React.ReactNode;
};

export const TestGroup: FC<TestGroupProps> = ({
  title,
  beforeEach,
  afterEach,
  beforeAll,
  afterAll,
  children, ...props }) => {
  const { addGroup } = useTestContext();
  const didInit = useRef(false);

  useEffect(() => {
    if (didInit.current) {
      return;
    }

    addGroup({
      title,
      beforeEach,
      afterEach,
      beforeAll,
      afterAll,
    });

    didInit.current = true;
  }, []);

  const DOMId = toValidDOMId(title);

  return <TestGroupProvider groupTitle={title}>
    <div
      data-test-group="true"
      id={DOMId}
      {...props}
    >
      {children}
    </div>
  </TestGroupProvider>
}
