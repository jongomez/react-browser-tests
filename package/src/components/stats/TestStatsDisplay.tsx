import { FC } from "react";
import { TestStateIcon, TestStats } from "../..";

export type TestStatsDisplayProps = {
  testStats: TestStats;
}


export const TestStatsDisplay: FC<TestStatsDisplayProps> = ({ testStats }) => {
  const { state, total, passed, failed, pending, running, skipped } = testStats;

  return (
    <div className="rbt-container-state-stats">
      {!!running && <TestStateIcon state="Running" />}

      <div className="rbt-icon-and-count">
        <TestStateIcon state="Success" />
        <div data-test-count="success">{passed}</div>
      </div>
      <div className="rbt-icon-and-count">
        <TestStateIcon state="Fail" />
        <div data-test-count="fail">{failed}</div>
      </div>
      <div className="rbt-icon-and-count">
        <TestStateIcon state="Skipped" />
        <div data-test-count="skipped">{skipped}</div>
      </div>
    </div>
  );
};