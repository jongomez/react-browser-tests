import { getTestStats } from "@/lib/testHelpers";
import { TestType } from "@/lib/types";
import { FC } from "react";

export type TestGroupStatsProps = {
  groupTitle: string;
  tests: TestType[];
}

export const TestGroupStats: FC<TestGroupStatsProps> = ({
  groupTitle,
  tests
}) => {
  const groupStats = getTestStats(tests);

  return (
    <div>
      <h3>{groupTitle}</h3>
      <p>passed: {groupStats.passed}</p>
      <p>failed: {groupStats.failed}</p>
    </div>
  );
}