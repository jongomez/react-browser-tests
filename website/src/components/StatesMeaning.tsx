import { FC } from "react";
import { TestState, TestStateIcon, getBorderStyles } from "react-browser-tests";

type SingleStateMeaningProps = {
  state: TestState;
  meaning: string;
}

const SingleStateMeaning: FC<SingleStateMeaningProps> = ({ state, meaning }) => {
  const classNames = "rbt-test single-state-meaning " + getBorderStyles(state)

  return (
    <div className={classNames}>
      <TestStateIcon state={state} />
      <p>{meaning}</p>
    </div>
  )
}

export const StatesMeaning = () => {
  return (
    <>
      <p>The test states are:</p>
      <SingleStateMeaning state={"Pending"} meaning="Pending - the test is waiting to start" />
      <SingleStateMeaning state={"Running"} meaning="Running - the test is currently running" />
      <SingleStateMeaning state={"Success"} meaning="Success - the test has passed" />
      <SingleStateMeaning state={"Fail"} meaning="Fail - the test has failed" />
      <SingleStateMeaning state={"Skipped"} meaning="Skipped - the test was skipped" />
    </>
  )

}