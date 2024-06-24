import { FC } from "react";
import { TestContainerState } from "../..";
import { useGetContainerStateUntilAllTestsFinish } from "../../lib/hooks";
import { getBorderStyles, getTestArrayFromContainerState, getTestStats, groupTests } from "../../lib/testHelpers";
import { TestArrayStats } from "../stats/TestArrayStats";
import { TestStatsDisplay } from "../stats/TestStatsDisplay";

export type SingleTestContainerOverviewProps = React.HTMLAttributes<HTMLDivElement> & {
  containerId?: string;
  iframeUrl?: string;
  title?: string;
  testsCompleteCallback?: (containerState: TestContainerState) => void;
  showGroupStats?: boolean;
}

export const SingleTestContainerOverview: FC<SingleTestContainerOverviewProps> = ({
  containerId,
  iframeUrl,
  title,
  testsCompleteCallback,
  showGroupStats = false,
  ...props
}) => {
  const containerState = useGetContainerStateUntilAllTestsFinish(containerId, iframeUrl, testsCompleteCallback);
  const testsArray = getTestArrayFromContainerState(containerState);
  const groupedTests = groupTests(testsArray, "(no test group)");
  const uniqueTestGroupTitles = Object.keys(groupedTests);
  const isLoading = !containerState;
  const containerStats = getTestStats(Object.values(containerState?.tests || []));
  const classNames = "rbt-overview " + getBorderStyles(containerStats.state);

  if (isLoading) {
    const loadingString = iframeUrl ? `Loading container for iframe '${iframeUrl}'` : `Loading tests for container id '${containerId}'`;
    return <div className={"rbt-overview " + getBorderStyles("Pending")}>{loadingString}</div>;
  }

  return (
    <div className={classNames} {...props}>
      <div className="rbt-overview-title-and-stats">
        {!!title && <span className="rbt-test-title">{title}</span>}
        <TestStatsDisplay testStats={containerStats} />
      </div>

      {showGroupStats && uniqueTestGroupTitles.map((groupTitle) => (
        <TestArrayStats key={groupTitle} groupTitle={groupTitle} tests={groupedTests[groupTitle]} />
      ))}
    </div>
  );
}
