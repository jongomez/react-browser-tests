import { FC } from "react";
import { TestStatsDisplay } from "..";
import { getBorderStyles, getTestStats } from "../../lib/testHelpers";
import { TestType } from "../../types";

export type TestArrayStatsProps = {
  groupTitle: string;
  tests: TestType[];
}

export const TestArrayStats: FC<TestArrayStatsProps> = ({
  groupTitle,
  tests
}) => {
  const groupStats = getTestStats(tests);
  const classNames = "rbt-test-array-stats " + getBorderStyles(groupStats.state)

  return (
    <div className={classNames}>
      <span className="rbt-test-title">{groupTitle}</span>
      <TestStatsDisplay testStats={groupStats} />
    </div>
  );
}