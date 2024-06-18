import { FC } from "react";
import { useGetContainerStateUntilAllTestsFinish } from "../../lib/hooks";
import { getBorderStyles, getTestArrayFromContainerState, getTestStats, groupTests } from "../../lib/testHelpers";
import { TestGroupStats } from "../stats/TestGroupStatsProps";
import { TestStatsDisplay } from "../stats/TestStatsDisplay";

export type SingleTestContainerOverviewProps = React.HTMLAttributes<HTMLDivElement> & {
  containerId?: string;
  iframeUrl?: string;
  title?: string;
  showGroupStats?: boolean;
}

export const SingleTestContainerOverview: FC<SingleTestContainerOverviewProps> = ({
  containerId,
  iframeUrl,
  title,
  showGroupStats = false,
  ...props
}) => {
  const containerState = useGetContainerStateUntilAllTestsFinish(containerId, iframeUrl);
  const testsArray = getTestArrayFromContainerState(containerState);
  const groupedTests = groupTests(testsArray, "(no test group)");
  const uniqueTestGroupTitles = Object.keys(groupedTests);
  const isLoading = !containerState;
  const containerStats = getTestStats(Object.values(containerState?.tests || []));
  const classNames = "rbt-overview " + getBorderStyles(containerStats.state);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className={classNames} {...props}>
      <div className="rbt-overview-title-and-stats">
        {!!title && <span className="rbt-test-title">{title}</span>}
        <TestStatsDisplay testStats={containerStats} />
      </div>

      {showGroupStats && uniqueTestGroupTitles.map((groupTitle) => (
        <TestGroupStats key={groupTitle} groupTitle={groupTitle} tests={groupedTests[groupTitle]} />
      ))}
    </div>
  );
}
