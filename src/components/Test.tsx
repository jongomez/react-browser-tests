import { toValidDOMId } from "@/lib/testHelpers";
import { TestState, TestType } from "@/lib/types";
import deepEqual from 'fast-deep-equal/react';
import { Check, CircleSlash, Hourglass, LoaderCircle, X } from "lucide-react";
import { FC, useEffect, useRef } from "react";
import { useTestContext } from "./TestContext";
import { useTestGroupContext } from "./TestGroupContext";

const getTestId = (testTitle: string, groupTitle: string): string => {
  if (!groupTitle) {
    return testTitle;
  }

  return `${groupTitle} - ${testTitle}`;
}

export type TestStateIconProps = {
  state: TestState;
};

export const TestStateIcon: FC<TestStateIconProps> = ({
  state
}) => {
  if (state === "Pending") {
    return <Hourglass />;
  } else if (state === "Running") {
    return <LoaderCircle className="spin-animation" />;
  } else if (state === "Fail") {
    return <X />
  } else if (state === "Success") {
    return <Check />
  } else if (state === "Skipped") {
    return <CircleSlash />
  }

  return null;
};

export type TitleAndStateProps = {
  currentTestState: TestState;
  title: string;
}

export const TitleAndStateDefault: FC<TitleAndStateProps> = ({ currentTestState, title }) => {
  return (
    <div className="test-title-and-result">
      <TestStateIcon state={currentTestState} />
      <div className="test-title">{title}</div>
      <div className="test-result">{currentTestState}</div>
    </div >
  )
}

const checkIfTestPropsChanged = (prevProps: TestProps | undefined, props: TestProps): boolean => {
  const previousFn = prevProps?.fn;
  const currentFn = props.fn;
  const fnChanged = previousFn?.toString() !== currentFn.toString();
  const skipChanged = prevProps?.skip !== props.skip;
  const onlyChanged = prevProps?.only !== props.only;
  const titleChanged = prevProps?.title !== props.title;
  const childrenChanged = !deepEqual(prevProps?.children, props.children);

  return fnChanged || skipChanged || onlyChanged || titleChanged || childrenChanged;
}

export type TestProps = React.HTMLAttributes<HTMLDivElement> & {
  title: string;
  fn: TestType["fn"];
  TitleAndState?: React.FC<TitleAndStateProps>;
  skip?: boolean;
  only?: boolean;
};

export const Test: FC<TestProps> = (props) => {
  const {
    title,
    fn,
    skip = false,
    only = false,
    TitleAndState = TitleAndStateDefault,
    children,
    ...propsRest } = props;
  const {
    tests,
    registerTest,
    reRunTests,
    reRunCount,
    containerId
  } = useTestContext();
  const groupContext = useTestGroupContext();

  // Refs go here.
  const prevPropsRef = useRef<TestProps | undefined>(props);
  const lastReRunCount = useRef<number>(-1);
  const didInit = useRef(false);

  // Get current test's Ids.
  const testId = getTestId(title, groupContext?.groupTitle || "");
  const DOMId = toValidDOMId(testId)

  // Get current test state.
  const currentTest = tests[testId];
  const currentTestState = currentTest?.state || "Pending";

  const propsHaveChanged = checkIfTestPropsChanged(prevPropsRef.current, props)

  useEffect(() => {
    // Skip effect if:
    // 1. The test has already been registered.
    // 2. The props haven't changed.
    // 3. reRunTests has already been called for this reRunCount.
    if (didInit.current && !propsHaveChanged && lastReRunCount.current === reRunCount) {
      return;
    }

    if (propsHaveChanged) {
      reRunTests();
    }

    const test: TestType = {
      title,
      groupTitle: groupContext?.groupTitle,
      id: testId,
      fn,
      skip,
      only,
      state: "Pending",
    };

    registerTest(test);

    prevPropsRef.current = props;
    lastReRunCount.current = reRunCount;
    didInit.current = true;
  }, [propsHaveChanged, reRunCount]);

  const shouldRenderChildren = currentTestState === "Running" ||
    currentTestState === "Success" ||
    currentTestState === "Fail";

  return <div data-test={containerId} id={DOMId} {...propsRest}>
    <TitleAndState currentTestState={currentTestState} title={title} />

    {shouldRenderChildren ? children : null}
  </div>
}