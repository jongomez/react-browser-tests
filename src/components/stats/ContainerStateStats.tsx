import { getTestStats } from "@/lib/testHelpers";
import { TestContainerState } from "@/lib/types";
import { FC } from "react";

export type ContainerStateStatsProps = {
  containerState: TestContainerState;
}

export const ContainerStateStats: FC<ContainerStateStatsProps> = ({ containerState }) => {
  const containerStats = getTestStats(Object.values(containerState.tests));

  return (
    <div>
      <h2>Container State Summary</h2>
      <p>totalNumberOfTests: {containerState.totalNumberOfTests}</p>
      <p>currentTestIndex: {containerState.currentTestIndex}</p>
      <p>reRunCount: {containerState.reRunCount}</p>
      <p>passed: {containerStats.passed}</p>
      <p>failed: {containerStats.failed}</p>
    </div>
  );
}
